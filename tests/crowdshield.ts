import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Crowdshield } from "../target/types/crowdshield";
import {
  createMint,
  createAssociatedTokenAccount,
  mintTo,
  getAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { assert } from "chai";

describe("crowdshield", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Crowdshield as Program<Crowdshield>;
  const organizer = anchor.web3.Keypair.generate();
  const fan = anchor.web3.Keypair.generate();
  const lp1 = anchor.web3.Keypair.generate();
  const lp2 = anchor.web3.Keypair.generate();
  const authority = provider.wallet;

  let usdcMint: anchor.web3.PublicKey;
  let organizerUsdc: anchor.web3.PublicKey;
  let fanUsdc: anchor.web3.PublicKey;
  let lp1Usdc: anchor.web3.PublicKey;
  let lp2Usdc: anchor.web3.PublicKey;

  let eventPda: anchor.web3.PublicKey;
  let poolPda: anchor.web3.PublicKey;
  let bondVault: anchor.web3.PublicKey;
  let bondAuthority: anchor.web3.PublicKey;
  let poolVault: anchor.web3.PublicKey;
  let poolAuthority: anchor.web3.PublicKey;
  let ticketVault: anchor.web3.PublicKey;
  let ticketVaultAuthority: anchor.web3.PublicKey;

  const eventName = "Wireless 2026";
  const ticketPrice = 50_000_000; // 50 USDC
  const maxTickets = 1000;
  const bondAmount = 10_000_000; // 10 USDC (2% of 50*1000=50000)

  before(async () => {
    // Airdrop SOL to all parties
    for (const kp of [organizer, fan, lp1, lp2]) {
      const sig = await provider.connection.requestAirdrop(
        kp.publicKey,
        10 * anchor.web3.LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(sig);
    }

    // Create USDC mint (authority = provider wallet)
    usdcMint = await createMint(
      provider.connection,
      (authority as any).payer,
      authority.publicKey,
      null,
      6
    );

    // Create token accounts
    organizerUsdc = await createAssociatedTokenAccount(
      provider.connection,
      (authority as any).payer,
      usdcMint,
      organizer.publicKey
    );
    fanUsdc = await createAssociatedTokenAccount(
      provider.connection,
      (authority as any).payer,
      usdcMint,
      fan.publicKey
    );
    lp1Usdc = await createAssociatedTokenAccount(
      provider.connection,
      (authority as any).payer,
      usdcMint,
      lp1.publicKey
    );
    lp2Usdc = await createAssociatedTokenAccount(
      provider.connection,
      (authority as any).payer,
      usdcMint,
      lp2.publicKey
    );

    // Mint USDC to all parties
    const mintAmount = 1_000_000_000; // 1000 USDC
    for (const dest of [organizerUsdc, fanUsdc, lp1Usdc, lp2Usdc]) {
      await mintTo(
        provider.connection,
        (authority as any).payer,
        usdcMint,
        dest,
        authority.publicKey,
        mintAmount
      );
    }

    // Derive PDAs
    [eventPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("event"), organizer.publicKey.toBuffer(), Buffer.from(eventName)],
      program.programId
    );
    [poolPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("pool"), eventPda.toBuffer()],
      program.programId
    );
    [bondVault] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("bond_vault"), eventPda.toBuffer()],
      program.programId
    );
    [bondAuthority] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("bond_authority"), eventPda.toBuffer()],
      program.programId
    );
    [poolVault] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("pool_vault"), eventPda.toBuffer()],
      program.programId
    );
    [poolAuthority] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("pool_authority"), eventPda.toBuffer()],
      program.programId
    );
    [ticketVault] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("ticket_vault"), eventPda.toBuffer()],
      program.programId
    );
    [ticketVaultAuthority] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("ticket_vault_authority"), eventPda.toBuffer()],
      program.programId
    );
  });

  // ─── CREATE EVENT ────────────────────────────────────────────

  it("creates an event with organizer bond", async () => {
    const eventDate = Math.floor(Date.now() / 1000) + 86400 * 30; // 30 days out

    await program.methods
      .createEvent(eventName, new anchor.BN(eventDate), new anchor.BN(ticketPrice), maxTickets, new anchor.BN(bondAmount))
      .accounts({
        organizer: organizer.publicKey,
        event: eventPda,
        coverPool: poolPda,
        bondVault,
        bondAuthority,
        poolVault,
        poolAuthority,
        ticketVault,
        ticketVaultAuthority,
        organizerUsdc,
        usdcMint,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([organizer])
      .rpc();

    const event = await program.account.event.fetch(eventPda);
    assert.equal(event.name, eventName);
    assert.equal(event.ticketPrice.toNumber(), ticketPrice);
    assert.equal(event.maxTickets, maxTickets);
    assert.equal(event.bondAmount.toNumber(), bondAmount);
    assert.equal(event.controversyScore, 0);
    assert.equal(event.resolvedMask, 0);
    assert.equal(event.outcomeMask, 0);

    const pool = await program.account.coverPool.fetch(poolPda);
    assert.equal(pool.totalLiquidity.toNumber(), 0);
    assert.equal(pool.totalDeposits.toNumber(), 0);
    assert.equal(pool.coversSold, 0);
    assert.equal(pool.maxCoverageRatio, 80);

    // Bond transferred to vault
    const vaultBalance = await getAccount(provider.connection, bondVault);
    assert.equal(Number(vaultBalance.amount), bondAmount);
  });

  it("rejects bond below 2% minimum", async () => {
    const lowBond = 100; // way below 2% of 50*1000=50000 USDC
    const badName = "Bad Event";
    const [badEventPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("event"), organizer.publicKey.toBuffer(), Buffer.from(badName)],
      program.programId
    );
    const [badPoolPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("pool"), badEventPda.toBuffer()],
      program.programId
    );
    const [badBondVault] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("bond_vault"), badEventPda.toBuffer()],
      program.programId
    );
    const [badBondAuth] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("bond_authority"), badEventPda.toBuffer()],
      program.programId
    );
    const [badPoolVault] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("pool_vault"), badEventPda.toBuffer()],
      program.programId
    );
    const [badPoolAuth] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("pool_authority"), badEventPda.toBuffer()],
      program.programId
    );
    const [badTicketVault] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("ticket_vault"), badEventPda.toBuffer()],
      program.programId
    );
    const [badTicketAuth] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("ticket_vault_authority"), badEventPda.toBuffer()],
      program.programId
    );

    try {
      await program.methods
        .createEvent(badName, new anchor.BN(Math.floor(Date.now() / 1000) + 86400), new anchor.BN(ticketPrice), maxTickets, new anchor.BN(lowBond))
        .accounts({
          organizer: organizer.publicKey,
          event: badEventPda,
          coverPool: badPoolPda,
          bondVault: badBondVault,
          bondAuthority: badBondAuth,
          poolVault: badPoolVault,
          poolAuthority: badPoolAuth,
          ticketVault: badTicketVault,
          ticketVaultAuthority: badTicketAuth,
          organizerUsdc,
          usdcMint,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([organizer])
        .rpc();
      assert.fail("Should have thrown BondTooLow");
    } catch (err: any) {
      assert.include(err.message, "BondTooLow");
    }
  });

  // ─── DEPOSIT LIQUIDITY ───────────────────────────────────────

  it("LP1 deposits liquidity", async () => {
    const depositAmount = 500_000_000; // 500 USDC

    const [lp1Position] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("lp_position"), poolPda.toBuffer(), lp1.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .depositLiquidity(new anchor.BN(depositAmount))
      .accounts({
        lp: lp1.publicKey,
        event: eventPda,
        coverPool: poolPda,
        lpPosition: lp1Position,
        poolVault,
        lpUsdc: lp1Usdc,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([lp1])
      .rpc();

    const pool = await program.account.coverPool.fetch(poolPda);
    assert.equal(pool.totalLiquidity.toNumber(), depositAmount);
    assert.equal(pool.totalDeposits.toNumber(), depositAmount);
    // 80% capacity
    assert.equal(pool.poolCapacity.toNumber(), depositAmount * 80 / 100);

    const pos = await program.account.lpPosition.fetch(lp1Position);
    assert.equal(pos.deposited.toNumber(), depositAmount);
  });

  it("LP2 deposits liquidity (multi-LP)", async () => {
    const depositAmount = 300_000_000; // 300 USDC

    const [lp2Position] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("lp_position"), poolPda.toBuffer(), lp2.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .depositLiquidity(new anchor.BN(depositAmount))
      .accounts({
        lp: lp2.publicKey,
        event: eventPda,
        coverPool: poolPda,
        lpPosition: lp2Position,
        poolVault,
        lpUsdc: lp2Usdc,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([lp2])
      .rpc();

    const pool = await program.account.coverPool.fetch(poolPda);
    assert.equal(pool.totalLiquidity.toNumber(), 800_000_000); // 500+300
    assert.equal(pool.totalDeposits.toNumber(), 800_000_000);
  });

  // ─── MINT TICKET ─────────────────────────────────────────────

  it("fan mints a ticket", async () => {
    // ticket_id will be 1 (tickets_sold goes 0 -> 1)
    const ticketId = 1;
    const [ticketPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("ticket"),
        eventPda.toBuffer(),
        new anchor.BN(ticketId).toArrayLike(Buffer, "le", 4),
      ],
      program.programId
    );

    await program.methods
      .mintTicket()
      .accounts({
        buyer: fan.publicKey,
        event: eventPda,
        ticket: ticketPda,
        ticketVault,
        buyerUsdc: fanUsdc,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([fan])
      .rpc();

    const event = await program.account.event.fetch(eventPda);
    assert.equal(event.ticketsSold, 1);

    const ticket = await program.account.ticket.fetch(ticketPda);
    assert.ok(ticket.owner.equals(fan.publicKey));
    assert.equal(ticket.ticketId, 1);
  });

  // ─── BUY COVER ───────────────────────────────────────────────

  let coverPda: anchor.web3.PublicKey;

  it("fan buys cancellation cover (requires ticket)", async () => {
    const payoutAmount = 300_000_000; // 300 USDC
    const coverTypeByte = 0; // Cancellation

    const ticketId = 1;
    const [ticketPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("ticket"),
        eventPda.toBuffer(),
        new anchor.BN(ticketId).toArrayLike(Buffer, "le", 4),
      ],
      program.programId
    );

    [coverPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("cover"),
        poolPda.toBuffer(),
        fan.publicKey.toBuffer(),
        Buffer.from([coverTypeByte]),
      ],
      program.programId
    );

    await program.methods
      .buyCover({ cancellation: {} }, new anchor.BN(payoutAmount))
      .accounts({
        buyer: fan.publicKey,
        event: eventPda,
        coverPool: poolPda,
        ticket: ticketPda,
        cover: coverPda,
        poolVault,
        buyerUsdc: fanUsdc,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([fan])
      .rpc();

    const cover = await program.account.cover.fetch(coverPda);
    assert.ok(cover.owner.equals(fan.publicKey));
    assert.equal(cover.payoutAmount.toNumber(), payoutAmount);
    assert.equal(cover.isResolved, false);
    assert.equal(cover.isClaimed, false);
    assert.ok(cover.premiumPaid.toNumber() > 0); // bonding curve calculated premium

    const pool = await program.account.coverPool.fetch(poolPda);
    assert.equal(pool.coversSold, 1);
    assert.equal(pool.totalExposure.toNumber(), payoutAmount);
  });

  // ─── UPDATE CONTROVERSY ──────────────────────────────────────

  it("authority updates controversy score", async () => {
    await program.methods
      .updateControversy(75)
      .accounts({
        authority: organizer.publicKey,
        event: eventPda,
      })
      .signers([organizer])
      .rpc();

    const event = await program.account.event.fetch(eventPda);
    assert.equal(event.controversyScore, 75);
  });

  it("rejects controversy score > 100", async () => {
    try {
      await program.methods
        .updateControversy(101)
        .accounts({
          authority: organizer.publicKey,
          event: eventPda,
        })
        .signers([organizer])
        .rpc();
      assert.fail("Should have thrown InvalidControversyScore");
    } catch (err: any) {
      assert.include(err.message, "InvalidControversyScore");
    }
  });

  // ─── RESOLVE ─────────────────────────────────────────────────

  it("resolves cancellation cover as YES", async () => {
    await program.methods
      .resolve({ cancellation: {} }, true)
      .accounts({
        authority: organizer.publicKey,
        event: eventPda,
        cover: coverPda,
      })
      .signers([organizer])
      .rpc();

    const cover = await program.account.cover.fetch(coverPda);
    assert.equal(cover.isResolved, true);
    assert.equal(cover.outcome, true);

    const event = await program.account.event.fetch(eventPda);
    // Bit 0 (Cancellation) set in resolved_mask
    assert.equal(event.resolvedMask & 1, 1);
    // Bit 0 set in outcome_mask (YES)
    assert.equal(event.outcomeMask & 1, 1);
    // Not fully resolved yet (only 1 of 5 cover types)
    assert.notEqual(event.resolvedMask, 0b11111);
  });

  it("rejects double resolution of same cover", async () => {
    try {
      await program.methods
        .resolve({ cancellation: {} }, false)
        .accounts({
          authority: organizer.publicKey,
          event: eventPda,
          cover: coverPda,
        })
        .signers([organizer])
        .rpc();
      assert.fail("Should have thrown EventAlreadyResolved");
    } catch (err: any) {
      assert.include(err.message, "EventAlreadyResolved");
    }
  });

  // ─── CLAIM PAYOUT ────────────────────────────────────────────

  it("fan claims payout after YES resolution", async () => {
    const fanBalanceBefore = (await getAccount(provider.connection, fanUsdc)).amount;

    await program.methods
      .claimPayout()
      .accounts({
        claimant: fan.publicKey,
        event: eventPda,
        coverPool: poolPda,
        cover: coverPda,
        poolVault,
        poolAuthority,
        claimantUsdc: fanUsdc,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([fan])
      .rpc();

    const cover = await program.account.cover.fetch(coverPda);
    assert.equal(cover.isClaimed, true);

    const fanBalanceAfter = (await getAccount(provider.connection, fanUsdc)).amount;
    const payout = Number(fanBalanceAfter) - Number(fanBalanceBefore);
    assert.equal(payout, 300_000_000); // 300 USDC

    const pool = await program.account.coverPool.fetch(poolPda);
    assert.equal(pool.totalExposure.toNumber(), 0); // exposure cleared
  });

  it("rejects double claim", async () => {
    try {
      await program.methods
        .claimPayout()
        .accounts({
          claimant: fan.publicKey,
          event: eventPda,
          coverPool: poolPda,
          cover: coverPda,
          poolVault,
          poolAuthority,
          claimantUsdc: fanUsdc,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([fan])
        .rpc();
      assert.fail("Should have thrown AlreadyClaimed");
    } catch (err: any) {
      assert.include(err.message, "AlreadyClaimed");
    }
  });

  // ─── CLAIM BOND (reads on-chain state) ───────────────────────

  it("organizer bond gets slashed when cancellation=YES on-chain", async () => {
    // First resolve remaining cover types so event is fully resolved
    // We need dummy covers for each type, but for this test we just check
    // that claim_bond reads cancellation outcome from event state.
    // The constraint requires cancellation to be resolved (which we did above).

    const poolVaultBefore = (await getAccount(provider.connection, poolVault)).amount;

    await program.methods
      .claimBond()
      .accounts({
        organizer: organizer.publicKey,
        event: eventPda,
        bondVault,
        bondAuthority,
        poolVault,
        poolAuthority,
        organizerUsdc,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([organizer])
      .rpc();

    // Bond slashed to pool (cancellation=YES on-chain)
    const poolVaultAfter = (await getAccount(provider.connection, poolVault)).amount;
    const bondSlashed = Number(poolVaultAfter) - Number(poolVaultBefore);
    assert.equal(bondSlashed, bondAmount);
  });

  // ─── WITHDRAW LIQUIDITY (multi-LP pro-rata) ──────────────────

  it("rejects LP withdrawal before full resolution", async () => {
    // Event only has cancellation resolved (1 of 5)
    // This should fail because is_fully_resolved() returns false
    const event = await program.account.event.fetch(eventPda);
    if (event.resolvedMask !== 0b11111) {
      const [lp1Position] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("lp_position"), poolPda.toBuffer(), lp1.publicKey.toBuffer()],
        program.programId
      );

      try {
        await program.methods
          .withdrawLiquidity()
          .accounts({
            lp: lp1.publicKey,
            event: eventPda,
            coverPool: poolPda,
            lpPosition: lp1Position,
            poolVault,
            poolAuthority,
            lpUsdc: lp1Usdc,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .signers([lp1])
          .rpc();
        assert.fail("Should have thrown EventNotResolved");
      } catch (err: any) {
        assert.include(err.message, "EventNotResolved");
      }
    }
  });
});
