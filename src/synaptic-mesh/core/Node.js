class Node {
  constructor(id, address, port) {
    this.id = id;
    this.address = address;
    this.port = port;
    this.status = 'initialized';
    this.neighbors = new Map();
    this.routingTable = new Map();
    this.createdAt = new Date();
    this.lastSeen = new Date();
  }

  async initialize() {
    this.status = 'ready';
    console.log(`Node ${this.id} initialized at ${this.address}:${this.port}`);
  }

  async connectToNeighbor(neighborNode) {
    try {
      // In a real implementation, this would establish an actual network connection
      this.neighbors.set(neighborNode.id, {
        node: neighborNode,
        connectedAt: new Date(),
        status: 'connected'
      });
      
      console.log(`Node ${this.id} connected to neighbor ${neighborNode.id}`);
      return true;
    } catch (error) {
      console.error(`Failed to connect to neighbor ${neighborNode.id}: ${error.message}`);
      return false;
    }
  }

  disconnectFromNeighbor(neighborId) {
    const neighbor = this.neighbors.get(neighborId);
    if (neighbor) {
      neighbor.status = 'disconnected';
      console.log(`Node ${this.id} disconnected from neighbor ${neighborId}`);
      return true;
    }
    return false;
  }

  updateRoutingTable(key, nodeInfo) {
    this.routingTable.set(key, nodeInfo);
    console.log(`Node ${this.id} updated routing table for key ${key}`);
  }

  getNeighbor(neighborId) {
    return this.neighbors.get(neighborId);
  }

  getAllNeighbors() {
    return Array.from(this.neighbors.values());
  }

  getStatus() {
    return this.status;
  }

  async shutdown() {
    // Disconnect from all neighbors
    for (const [neighborId, neighbor] of this.neighbors) {
      await this.disconnectFromNeighbor(neighborId);
    }
    
    this.status = 'shutdown';
    console.log(`Node ${this.id} shutdown`);
  }
}

module.exports = Node;