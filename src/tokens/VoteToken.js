class VoteToken {
  constructor() {
    this.name = 'VOTE';
    this.symbol = 'VOTE';
    this.decimals = 18;
    this.totalSupply = 0;
    this.balances = new Map();
    this.allowances = new Map();
  }

  mint(to, amount) {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }
    
    const currentBalance = this.balances.get(to) || 0;
    this.balances.set(to, currentBalance + amount);
    this.totalSupply += amount;
    
    console.log(`Minted ${amount} VOTE tokens to ${to}`);
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
    
    console.log(`Transferred ${amount} VOTE tokens from ${from} to ${to}`);
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
    
    console.log(`Transferred ${amount} VOTE tokens from ${from} to ${to} via ${sender}`);
    return true;
  }

  approve(owner, spender, amount) {
    const allowanceKey = `${spender}:${owner}`;
    this.allowances.set(allowanceKey, amount);
    
    console.log(`Approved ${spender} to spend ${amount} VOTE tokens from ${owner}`);
    return true;
  }

  balanceOf(address) {
    return this.balances.get(address) || 0;
  }

  allowance(owner, spender) {
    const allowanceKey = `${spender}:${owner}`;
    return this.allowances.get(allowanceKey) || 0;
  }
}

module.exports = VoteToken;