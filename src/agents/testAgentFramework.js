const AgentFramework = require('./agents/AgentFramework');

async function testAgentFramework() {
  console.log('Testing Agent Framework...');
  
  // Create framework instance
  const framework = new AgentFramework();
  
  try {
    // Initialize framework
    await framework.initialize();
    
    // Start framework
    await framework.start();
    
    // Test agent retrieval
    const registrationAgent = framework.getAgent('reg-001');
    console.log('Registration Agent:', registrationAgent ? 'Found' : 'Not Found');
    
    const authenticationAgent = framework.getAgent('auth-001');
    console.log('Authentication Agent:', authenticationAgent ? 'Found' : 'Not Found');
    
    // Test token systems
    const voteToken = framework.getVoteToken();
    voteToken.mint('voter-001', 100);
    console.log('VOTE Token Balance for voter-001:', voteToken.balanceOf('voter-001'));
    
    const validToken = framework.getValidToken();
    validToken.mint('validator-001', 1000);
    console.log('VALID Token Balance for validator-001:', validToken.balanceOf('validator-001'));
    
    // Test staking
    const stakingManager = framework.getStakingManager();
    stakingManager.stakeInPool('validation-pool', 'validator-001', 100);
    console.log('Staked 100 VALID tokens in validation pool');
    
    // Test crypto
    const crypto = framework.getCrypto();
    const kemKeypair = await crypto.generateKEMKeypair();
    console.log('Generated KEM keypair:', kemKeypair ? 'Success' : 'Failed');
    
    const encapsulation = await crypto.encapsulate(kemKeypair.publicKey);
    console.log('KEM encapsulation:', encapsulation ? 'Success' : 'Failed');
    
    // Test ZKP
    const zkp = framework.getZKP();
    const mockBallot = { id: 'ballot-001', electionId: 'election-001', generatedAt: new Date() };
    const ballotProof = await zkp.generateBallotProof(mockBallot, 'secret-001');
    console.log('Generated ballot proof:', ballotProof ? 'Success' : 'Failed');
    
    // Test communication
    const messageResult = await framework.sendMessage('reg-001', 'auth-001', { action: 'new-registration', voterId: 'voter-001' });
    console.log('Agent communication:', messageResult ? 'Success' : 'Failed');
    
    // Let the framework run for a bit
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Stop framework
    await framework.stop();
    
    console.log('Agent Framework test completed successfully');
  } catch (error) {
    console.error('Agent Framework test failed:', error.message);
  }
}

// Run the test
if (require.main === module) {
  testAgentFramework();
}

module.exports = testAgentFramework;