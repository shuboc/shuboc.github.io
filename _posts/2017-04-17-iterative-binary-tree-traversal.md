---
title: "[教學] 迭代遍歷二元樹 (Iteratively Traverse Binary Tree)"
tags: [algorithm, binary tree]
redirect_from: /2017/04/17/iterative-binary-tree-traversal
last_modified_at: 2018/12/29
---

這篇筆記整理了迭代法遍歷二元樹(Iteratively Binary Tree Traversal)的三種順序(pre-order/in-order/post-order)的寫法。

迭代(iteratively)相對於遞迴(recursively)的遍歷二元樹(binary tree traversal)方法較為不直觀，為了符合traverse的順序，有些節點需要晚點再拜訪，實作上會用到stack的資料結構。

## Tree Traversal

[Tree Traversal Wiki](https://en.wikipedia.org/wiki/Tree_traversal#Depth-first_search)

pre-, in-, post-是指parent node相對於child node的順序。假設binary search tree如下：

~~~
    4
   / \
  2   6
 / \ / \
1  3 5  7
~~~

* preorder: 中->左->右，4213657
* inorder: 左->中->右，1234567 (對binary search tree做inorder traversal就是依序拿取)
* postorder: 左->右->中，1325764

## Preorder Traversal

Preorder需先拜訪父節點再拜訪子節點。利用stack實作，將stack頂端的值取出後，把左右子節點放進stack，直到stack為空。

~~~C
vector<int> preorderTraversal(TreeNode *root) {
  vector<int> res;
  if (!root) return res;

  stack<TreeNode*> s;
  s.push(root);
  while (s.size() > 0) {
    TreeNode *node = s.top();
    s.pop();
    res.push_back(node->val);
    if (node->right) s.push(node->right);
    if (node->left) s.push(node->left);
  }

  return res;
}
~~~

## Inorder Traversal

Inorder先拜訪左子節點，再拜訪父節點，最後拜訪右子節點。我們需要盡量往左子節點前進，而途中經過的父節點們就先存在一個stack裡面，等到沒有更多左子節點時，就把stack中的父節點取出並拜訪其右子節點。

~~~C
vector<int> inorderTraversal(TreeNode* root) {
  vector<int> res;
  if (!root) return res;

  stack<TreeNode *> s;
  TreeNode *cur = root;
  while (cur || !s.empty()) {
    if (cur) {
      s.push(cur);
      cur = cur->left;
    } else {
      TreeNode *node = s.top();
      s.pop();
      res.push_back(node->val);
      cur = node->right;
    }
  }

  return res;
}
~~~

## Postorder Traversal

Postorder需先拜訪左右子節點，最後拜訪父節點。遍歷每個節點時，將父節點和左右子節點都放進stack中，並將父節點的左右子節點設為`NULL`。當stack pop出一個節點沒有左右子節點時，表示他的左右子節點已經被拜訪過了，則可以拜訪父節點。

~~~C
vector<int> inorderTraversal(TreeNode* root) {
  vector<int> res;
  if (!root) return res;

  stack<TreeNode *> s;
  s.push(root);

  while (s.size()) {
    TreeNode *node = s.top();
    if (!node->left && !node->right) {
      s.pop();
      res.push_back(node->val);
    }

    if (node->right) {
      s.push(node->right);
      node->right = NULL;
    }

    if (node->left) {
      s.push(node->left);
      node->left = NULL;
    }
  }

  return res;
}
~~~
