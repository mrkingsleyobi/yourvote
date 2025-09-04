class DistributedHashTable {
  constructor() {
    this.table = new Map();
    this.nodes = new Map();
  }

  // Hash function for keys
  hashKey(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      const char = key.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Find the node responsible for a key
  findResponsibleNode(key) {
    const keyHash = this.hashKey(key);
    
    // In a real DHT, this would use consistent hashing
    // For simplicity, we'll just find the node with the closest ID
    let responsibleNode = null;
    let minDistance = Infinity;
    
    for (const [nodeId, nodeInfo] of this.nodes) {
      const nodeHash = this.hashKey(nodeId);
      const distance = Math.abs(nodeHash - keyHash);
      
      if (distance < minDistance) {
        minDistance = distance;
        responsibleNode = nodeId;
      }
    }
    
    return responsibleNode;
  }

  // Store a key-value pair
  async put(key, value, nodeId = null) {
    const targetNode = nodeId || this.findResponsibleNode(key);
    
    if (!targetNode) {
      throw new Error('No nodes available in DHT');
    }
    
    if (!this.table.has(targetNode)) {
      this.table.set(targetNode, new Map());
    }
    
    this.table.get(targetNode).set(key, {
      value,
      timestamp: Date.now(),
      ttl: 3600000 // 1 hour TTL
    });
    
    console.log(`Stored key ${key} on node ${targetNode}`);
    return targetNode;
  }

  // Retrieve a value by key
  async get(key) {
    const targetNode = this.findResponsibleNode(key);
    
    if (!targetNode || !this.table.has(targetNode)) {
      return null;
    }
    
    const nodeTable = this.table.get(targetNode);
    const entry = nodeTable.get(key);
    
    if (!entry) {
      return null;
    }
    
    // Check TTL
    if (Date.now() - entry.timestamp > entry.ttl) {
      nodeTable.delete(key);
      return null;
    }
    
    return entry.value;
  }

  // Register a node in the DHT
  registerNode(nodeId, nodeInfo) {
    this.nodes.set(nodeId, nodeInfo);
    console.log(`Registered node ${nodeId} in DHT`);
  }

  // Unregister a node from the DHT
  unregisterNode(nodeId) {
    this.nodes.delete(nodeId);
    
    // Remove all entries stored on this node
    if (this.table.has(nodeId)) {
      this.table.delete(nodeId);
    }
    
    console.log(`Unregistered node ${nodeId} from DHT`);
  }

  // Get statistics
  getStats() {
    let totalEntries = 0;
    for (const nodeTable of this.table.values()) {
      totalEntries += nodeTable.size;
    }
    
    return {
      nodes: this.nodes.size,
      entries: totalEntries,
      tables: this.table.size
    };
  }
}

module.exports = DistributedHashTable;