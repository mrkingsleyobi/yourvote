const Node = require('./Node');
const crypto = require('crypto');

class Network {
  constructor() {
    this.nodes = new Map();
    this.networkId = crypto.randomUUID();
    this.createdAt = new Date();
  }

  async createNode(id, address, port) {
    const node = new Node(id, address, port);
    await node.initialize();
    this.nodes.set(id, node);
    console.log(`Network created node ${id}`);
    return node;
  }

  getNode(nodeId) {
    return this.nodes.get(nodeId);
  }

  getAllNodes() {
    return Array.from(this.nodes.values());
  }

  async connectNodes(nodeId1, nodeId2) {
    const node1 = this.getNode(nodeId1);
    const node2 = this.getNode(nodeId2);
    
    if (!node1 || !node2) {
      throw new Error('One or both nodes not found');
    }
    
    // Connect both ways for bidirectional communication
    const result1 = await node1.connectToNeighbor(node2);
    const result2 = await node2.connectToNeighbor(node1);
    
    return result1 && result2;
  }

  async removeNode(nodeId) {
    const node = this.nodes.get(nodeId);
    if (node) {
      await node.shutdown();
      this.nodes.delete(nodeId);
      console.log(`Network removed node ${nodeId}`);
      return true;
    }
    return false;
  }

  getNetworkSize() {
    return this.nodes.size;
  }

  async shutdown() {
    // Shutdown all nodes
    for (const [nodeId, node] of this.nodes) {
      await node.shutdown();
    }
    
    this.nodes.clear();
    console.log(`Network ${this.networkId} shutdown`);
  }
}

module.exports = Network;