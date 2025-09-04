class StakingManager {
  constructor(validToken) {
    this.validToken = validToken;
    this.stakingPools = new Map();
    this.rewardRates = new Map();
    this.slashingConditions = new Map();
  }

  createStakingPool(poolId, rewardRate = 0.05) {
    this.stakingPools.set(poolId, {
      id: poolId,
      totalStaked: 0,
      participants: new Map(),
      createdAt: new Date()
    });
    
    this.rewardRates.set(poolId, rewardRate);
    
    console.log(`Staking pool ${poolId} created with reward rate ${rewardRate}`);
    return true;
  }

  stakeInPool(poolId, address, amount) {
    const pool = this.stakingPools.get(poolId);
    if (!pool) {
      throw new Error('Staking pool not found');
    }
    
    // Stake tokens
    const stakeId = this.validToken.stake(address, amount);
    
    // Record in pool
    if (!pool.participants.has(address)) {
      pool.participants.set(address, {
        totalStaked: 0,
        stakes: []
      });
    }
    
    const participant = pool.participants.get(address);
    participant.totalStaked += amount;
    participant.stakes.push({
      stakeId,
      amount,
      stakedAt: new Date()
    });
    
    pool.totalStaked += amount;
    
    console.log(`${address} staked ${amount} VALID tokens in pool ${poolId}`);
    return stakeId;
  }

  unstakeFromPool(poolId, address, stakeId) {
    const pool = this.stakingPools.get(poolId);
    if (!pool) {
      throw new Error('Staking pool not found');
    }
    
    // Unstake tokens
    this.validToken.unstake(stakeId);
    
    // Update pool records
    const participant = pool.participants.get(address);
    if (participant) {
      const stakeIndex = participant.stakes.findIndex(s => s.stakeId === stakeId);
      if (stakeIndex !== -1) {
        const stake = participant.stakes[stakeIndex];
        participant.totalStaked -= stake.amount;
        participant.stakes.splice(stakeIndex, 1);
        
        pool.totalStaked -= stake.amount;
      }
    }
    
    console.log(`${address} unstaked from pool ${poolId}`);
    return true;
  }

  distributeRewards(poolId) {
    const pool = this.stakingPools.get(poolId);
    if (!pool) {
      throw new Error('Staking pool not found');
    }
    
    const rewardRate = this.rewardRates.get(poolId) || 0.05;
    const totalRewards = pool.totalStaked * rewardRate;
    
    // Distribute rewards proportionally
    for (const [address, participant] of pool.participants) {
      const share = participant.totalStaked / pool.totalStaked;
      const rewardAmount = totalRewards * share;
      
      // Mint reward tokens (in a real implementation, this would come from a reward pool)
      // For demo purposes, we'll just log the reward
      console.log(`Rewarding ${address} with ${rewardAmount} VALID tokens`);
    }
    
    console.log(`Distributed ${totalRewards} VALID tokens as rewards for pool ${poolId}`);
    return totalRewards;
  }

  addSlashingCondition(conditionId, condition, penaltyRate = 0.1) {
    this.slashingConditions.set(conditionId, {
      id: conditionId,
      condition,
      penaltyRate,
      createdAt: new Date()
    });
    
    console.log(`Slashing condition ${conditionId} added with penalty rate ${penaltyRate}`);
    return true;
  }

  applySlashing(conditionId, address, reason) {
    const condition = this.slashingConditions.get(conditionId);
    if (!condition) {
      throw new Error('Slashing condition not found');
    }
    
    // Find stakes to slash
    const stakesToSlash = [];
    
    for (const [poolId, pool] of this.stakingPools) {
      const participant = pool.participants.get(address);
      if (participant) {
        stakesToSlash.push(...participant.stakes.map(s => ({
          poolId,
          stake: s,
          participant
        })));
      }
    }
    
    // Apply penalties
    const totalSlashed = 0;
    for (const stakeInfo of stakesToSlash) {
      const penaltyAmount = stakeInfo.stake.amount * condition.penaltyRate;
      // In a real implementation, this would actually remove/burn tokens
      console.log(`Slashed ${penaltyAmount} VALID tokens from ${address} for ${reason}`);
    }
    
    console.log(`Applied slashing condition ${conditionId} to ${address} for ${reason}`);
    return totalSlashed;
  }
}

module.exports = StakingManager;