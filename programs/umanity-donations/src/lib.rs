use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("BW8QEjNXreRdzHoQP8C2uRZaZu5pqZD6VK4f6yidpQ1P");

#[program]
pub mod umanity_donations {
    use super::*;

    // Initialize donation pool
    pub fn initialize_pool(
        ctx: Context<InitializePool>,
        name: String,
        description: String,
        emoji: String,
        pool_type: u8,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        pool.authority = ctx.accounts.authority.key();
        pool.name = name;
        pool.description = description;
        pool.emoji = emoji;
        pool.pool_type = pool_type;
        pool.total_donated = 0;
        pool.donor_count = 0;
        pool.is_active = true;
        pool.bump = ctx.bumps.pool;
        Ok(())
    }

    // One-tap donation (1 USDC)
    pub fn one_tap_donate(ctx: Context<OneTapDonate>) -> Result<()> {
        let amount = 1_000_000; // 1 USDC (6 decimals)

        // Transfer SOL equivalent of $1
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.donor.to_account_info(),
                to: ctx.accounts.pool_vault.to_account_info(),
            },
        );
        system_program::transfer(cpi_context, amount)?;

        // Update pool stats
        let pool = &mut ctx.accounts.pool;
        pool.total_donated = pool.total_donated.checked_add(amount).unwrap();
        pool.donor_count = pool.donor_count.checked_add(1).unwrap();

        // Record donation
        let donation_record = &mut ctx.accounts.donation_record;
        donation_record.donor = ctx.accounts.donor.key();
        donation_record.pool = ctx.accounts.pool.key();
        donation_record.amount = amount;
        donation_record.timestamp = Clock::get()?.unix_timestamp;
        donation_record.donation_type = 0; // One-tap

        emit!(DonationMade {
            donor: ctx.accounts.donor.key(),
            pool: ctx.accounts.pool.key(),
            amount,
            donation_type: 0,
        });

        Ok(())
    }

    // Custom amount donation to pool
    pub fn donate_to_pool(
        ctx: Context<DonateToPool>,
        amount: u64,
    ) -> Result<()> {
        require!(amount > 0, ErrorCode::InvalidAmount);

        // Transfer SOL
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.donor.to_account_info(),
                to: ctx.accounts.pool_vault.to_account_info(),
            },
        );
        system_program::transfer(cpi_context, amount)?;

        // Update pool stats
        let pool = &mut ctx.accounts.pool;
        pool.total_donated = pool.total_donated.checked_add(amount).unwrap();
        pool.donor_count = pool.donor_count.checked_add(1).unwrap();

        // Record donation
        let donation_record = &mut ctx.accounts.donation_record;
        donation_record.donor = ctx.accounts.donor.key();
        donation_record.pool = ctx.accounts.pool.key();
        donation_record.amount = amount;
        donation_record.timestamp = Clock::get()?.unix_timestamp;
        donation_record.donation_type = 1; // Custom pool

        emit!(DonationMade {
            donor: ctx.accounts.donor.key(),
            pool: ctx.accounts.pool.key(),
            amount,
            donation_type: 1,
        });

        Ok(())
    }

    // Withdraw from pool (admin only)
    pub fn withdraw_from_pool(
        ctx: Context<WithdrawFromPool>,
        amount: u64,
        recipient: Pubkey,
    ) -> Result<()> {
        require!(amount > 0, ErrorCode::InvalidAmount);

        let pool = &ctx.accounts.pool;
        let vault_balance = ctx.accounts.pool_vault.lamports();
        require!(vault_balance >= amount, ErrorCode::InsufficientFunds);

        // Transfer from vault to recipient
        **ctx.accounts.pool_vault.try_borrow_mut_lamports()? -= amount;
        **ctx.accounts.recipient.try_borrow_mut_lamports()? += amount;

        emit!(PoolWithdrawal {
            pool: pool.key(),
            recipient,
            amount,
        });

        Ok(())
    }
}

// Contexts
#[derive(Accounts)]
#[instruction(name: String)]
pub struct InitializePool<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Pool::INIT_SPACE,
        seeds = [b"pool", name.as_bytes()],
        bump
    )]
    pub pool: Account<'info, Pool>,

    /// CHECK: Pool vault PDA
    #[account(
        seeds = [b"vault", pool.key().as_ref()],
        bump
    )]
    pub pool_vault: AccountInfo<'info>,

    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct OneTapDonate<'info> {
    #[account(mut)]
    pub pool: Account<'info, Pool>,

    /// CHECK: Pool vault PDA
    #[account(
        mut,
        seeds = [b"vault", pool.key().as_ref()],
        bump
    )]
    pub pool_vault: AccountInfo<'info>,

    #[account(
        init,
        payer = donor,
        space = 8 + DonationRecord::INIT_SPACE
    )]
    pub donation_record: Account<'info, DonationRecord>,

    #[account(mut)]
    pub donor: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DonateToPool<'info> {
    #[account(mut)]
    pub pool: Account<'info, Pool>,

    /// CHECK: Pool vault PDA
    #[account(
        mut,
        seeds = [b"vault", pool.key().as_ref()],
        bump
    )]
    pub pool_vault: AccountInfo<'info>,

    #[account(
        init,
        payer = donor,
        space = 8 + DonationRecord::INIT_SPACE
    )]
    pub donation_record: Account<'info, DonationRecord>,

    #[account(mut)]
    pub donor: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct WithdrawFromPool<'info> {
    #[account(
        mut,
        has_one = authority
    )]
    pub pool: Account<'info, Pool>,

    /// CHECK: Pool vault PDA
    #[account(
        mut,
        seeds = [b"vault", pool.key().as_ref()],
        bump
    )]
    pub pool_vault: AccountInfo<'info>,

    /// CHECK: Recipient account
    #[account(mut)]
    pub recipient: AccountInfo<'info>,

    pub authority: Signer<'info>,
}

// Accounts
#[account]
#[derive(InitSpace)]
pub struct Pool {
    pub authority: Pubkey,
    #[max_len(50)]
    pub name: String,
    #[max_len(200)]
    pub description: String,
    #[max_len(10)]
    pub emoji: String,
    pub pool_type: u8, // 0: Medical, 1: Education, 2: Emergency, etc.
    pub total_donated: u64,
    pub donor_count: u64,
    pub is_active: bool,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct DonationRecord {
    pub donor: Pubkey,
    pub pool: Pubkey,
    pub amount: u64,
    pub timestamp: i64,
    pub donation_type: u8, // 0: One-tap, 1: Custom pool, 2: Tip
}

// Events
#[event]
pub struct DonationMade {
    pub donor: Pubkey,
    pub pool: Pubkey,
    pub amount: u64,
    pub donation_type: u8,
}

#[event]
pub struct PoolWithdrawal {
    pub pool: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
}

// Errors
#[error_code]
pub enum ErrorCode {
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("Insufficient funds")]
    InsufficientFunds,
}
