//Log current document title and body

console.log("initial document title:", document.title);
console.log("document.body:", document.body);

//documentElement(root<html>)and childNode
console.log("document.documentElement(root)", document.documentElement);
console.log("body childNode", document.body.childNodes);

//change title + visible text where button clicked
const changeBtn = document.getElementById("change-title");
changeBtn.addEventListener("click", function () {
  //change browser tab title
  document.title = "Dom Changed by JS";

  //change page content visible in body
  const heading = document.getElementById("main-hading");
  heading.innerText = "Title was changed!";
  const intro = document.getElementById("intro");
  intro.textContent = "Look at the browser tab - title updated by js";
});

//Print a simple Dom tree to console(recursion)

function showDomTree(node, depth = 0) {
  const indent = " ".repeat(depth);
  //show node name and nodetype
  console.log(
    indent + node.nodeName + (node.nodeType === 3 ? "(text node)" : "")
  );
  node.childNodes.forEach((child) => showDomTree(child, depth + 1));
}
const treeBtn = document.getElementById("show-title");
treeBtn.addEventListener("click", function () {
  console.log("---DOM TREE START---");
  showDomTree(document.documentElement);
  console.log("---DOM TREE END---");
});
