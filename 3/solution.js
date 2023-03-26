class OrganizationNode {
  constructor(label) {
    this.label = label;
    this.children = [];
  }
}

class Tree {
  constructor(label) {
    this.rootLabel = new OrganizationNode(label);
  }

  addChild(parentNode, label) {
    const childNode = new OrganizationNode(label);
    parentNode.children.push(childNode);
    return childNode;
  }

  traversePreorder(node) {
    console.log(node.label);
    node.children.forEach((child) => {
      this.traversePreorder(child);
    });
  }
}

const tree = new Tree(1);
const node2 = tree.addChild(tree.rootLabel, 2);
const node3 = tree.addChild(node2, 3);
const node4 = tree.addChild(node2, 4);
const node5 = tree.addChild(tree.rootLabel, 5);
const node6 = tree.addChild(tree.rootLabel, 6);
const node7 = tree.addChild(node6, 7);
const node8 = tree.addChild(node6, 8);
const node9 = tree.addChild(node8, 9);

tree.traversePreorder(tree.rootLabel);
