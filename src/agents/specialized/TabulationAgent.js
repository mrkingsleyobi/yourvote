const SpecializedAgent = require('../core/SpecializedAgent');

class TabulationAgent extends SpecializedAgent {
  constructor(id, config = {}) {
    super(id, 'daa', 'tabulation', config);
    this.addCapability('vote-tabulation');
    this.addCapability('result-calculation');
    this.electionResults = new Map();
  }

  async executeSpecializedTask(task) {
    switch (task.action) {
      case 'tabulate-votes':
        return await this.tabulateVotes(task.data);
      case 'calculate-results':
        return await this.calculateResults(task.data);
      default:
        throw new Error(`Unknown action: ${task.action}`);
    }
  }

  async tabulateVotes(tabulationData) {
    // Tabulate votes for an election (simplified for example)
    const electionId = tabulationData.electionId;
    const candidateVotes = new Map();
    
    // Simulate vote counting
    tabulationData.votes.forEach(vote => {
      const candidate = vote.candidateId;
      if (candidateVotes.has(candidate)) {
        candidateVotes.set(candidate, candidateVotes.get(candidate) + 1);
      } else {
        candidateVotes.set(candidate, 1);
      }
    });
    
    const results = {
      electionId,
      tabulatedAt: new Date(),
      totalVotes: tabulationData.votes.length,
      candidateVotes: Object.fromEntries(candidateVotes)
    };
    
    this.electionResults.set(electionId, results);
    
    console.log(`Votes tabulated for election ${electionId}`);
    return { success: true, results };
  }

  async calculateResults(calculationData) {
    // Calculate final election results (simplified for example)
    const electionId = calculationData.electionId;
    const results = this.electionResults.get(electionId);
    
    if (!results) {
      throw new Error(`No tabulated results found for election ${electionId}`);
    }
    
    // Determine winner
    let winner = null;
    let maxVotes = 0;
    
    for (const [candidate, votes] of Object.entries(results.candidateVotes)) {
      if (votes > maxVotes) {
        maxVotes = votes;
        winner = candidate;
      }
    }
    
    const finalResults = {
      ...results,
      winner,
      winningVotes: maxVotes,
      status: 'finalized'
    };
    
    this.electionResults.set(electionId, finalResults);
    
    console.log(`Results calculated for election ${electionId}. Winner: ${winner}`);
    return { success: true, results: finalResults };
  }
}

module.exports = TabulationAgent;