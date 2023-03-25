  function generateTree(nodes) {
    const childrenMap = {};
    nodes.forEach(node => {
      childrenMap[node.label] = [];
    });
  

    nodes.forEach(node => {
      if (node.parent !== null) {
        childrenMap[node.parent].push(node);
      }
    });
  
 
    function buildTree(label) {
      const children = childrenMap[label].map(child => buildTree(child.label));
      return { label, children };
    }
  
    const rootNodes = nodes.filter(node => node.parent === null);
    const trees = rootNodes.map(node => buildTree(node.label));
  

    if (trees.length === 1) {
      return trees[0];
    }
  
    return { label: null, children: trees };
  }
  
  

  const A = [
    { label: 1, parent: null },
    { label: 2, parent: 1 },
    { label: 3, parent: 2 },
    { label: 4, parent: 2 },
    { label: 5, parent: 1 },
    { label: 6, parent: 1 },
    { label: 7, parent: 6 },
    { label: 8, parent: 6 },
    { label: 9, parent: 8 },
  ];
  
  const treeA = generateTree(A);
  console.log(treeA);