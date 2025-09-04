class ValidToken {
  constructor() {
    this.name = 'VALID';
    this.symbol = 'VALID';
    this.decimals = 18;
    this.totalSupply = 0;
    this.balances = new Map();
    this.allowances = new Map();
    this.stakingRecords = new Map();
  }

  mint(to, amount) {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }
    
    const currentBalance = this.balances.get(to) || 0;
    this.balances.set(to, currentBalance + amount);
    this.totalSupply += amount;
    
    console.log(`Minted ${amount} VALID tokens to ${to}`);
    return true;
  }

  transfer(from, to, amount) {
    const fromBalance = this.balances.get(from) || 0;
    
    if (fromBalance < amount) {
      throw new Error('Insufficient balance');
    }
    
    const toBalance = this.balances.get(to) || 0;
    
    this.balances.set(from, fromBalance - amount);
    this.balances.set(to, toBalance + amount);
    
    console.log(`Transferred ${amount} VALID tokens from ${from} to ${to}`);
    return true;
  }

  transferFrom(sender, from, to, amount) {
    const allowanceKey = `${sender}:${from}`;
    const allowance = this.allowances.get(allowanceKey) || 0;
    
    if (allowance < amount) {
      throw new Error('Insufficient allowance');
    }
    
    const fromBalance = this.balances.get(from) || 0;
    
    if (fromBalance < amount) {
      throw new Error('Insufficient balance');
    }
    
    const toBalance = this.balances.get(to) || 0;
    
    this.balances.set(from, fromBalance - amount);
    this.balances.set(to, toBalance + amount);
    this.allowances.set(allowanceKey, allowance - amount);
    
    console.log(`Transferred ${amount} VALID tokens from ${from} to ${to} via ${sender}`);
    return true;
  }

  approve(owner, spender, amount) {
    const allowanceKey = `${spender}:${owner}`;
    this.allowances.set(allowanceKey, amount);
    
    console.log(`Approved ${spender} to spend ${amount} VALID tokens from ${owner}`);
    return true;
  }

  balanceOf(address) {
    return this.balances.get(address) || 0;
  }

  allowance(owner, spender) {
    const allowanceKey = `${spender}:${owner}`;
    return this.allowances.get(allowanceKey) || 0;
  }

  stake(address, amount) {
    const balance = this.balances.get(address) || 0;
    
    if (balance < amount) {
      throw new Error('Insufficient balance for staking');
    }
    
    this.balances.set(address, balance - amount);
    
    const stakeId = 'stake_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const stakeRecord = {
      id: stakeId,
      address,
      amount,
      stakedAt: new Date(),
      status: 'active'
    };
    
    this.stakingRecords.set(stakeId, stakeRecord);
    
    console.log(`${address} staked ${amount} VALID tokens`);
    return stakeId;
  }

  unstake(stakeId) {
    const stakeRecord = this.stakingRecords.get(stakeId);
    
    if (!stakeRecord) {
      throw new Error('Stake record not found');
    }
    
    if (stakeRecord.status !== 'active') {
      throw new Error('Stake is not active');
    }
    
    const balance = this.balances.get(stakeRecord.address) || 0;
    this.balances.set(stakeRecord.address, balance + stakeRecord.amount);
    
    stakeRecord.status = 'unstaked';
    stakeRecord.unstakedAt = new Date();
    
    console.log(`${stakeRecord.address} unstaked ${stakeRecord.amount} VALID tokens`);
    return true;
  }
}

module.exports = ValidToken;