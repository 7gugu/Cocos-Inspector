// 获取游戏的Canvas节点
const canvas = cc.director.getScene().getChildByName("Canvas");

const borderGraphicsNode = new cc.Node("BorderGraphicsNode");
const borderGraphics = borderGraphicsNode.addComponent(cc.Graphics);
canvas.getChildByName("uiLayer").addChild(borderGraphicsNode);

// 遍历游戏中的所有节点
function traverseNode(node, i = 0) {
  if (node) {
    // 为节点添加鼠标事件
    addMouseEvents(node);

    // 遍历子节点
    for (let i = 0; i < node.childrenCount; i++) {
      traverseNode(node.children[i], i);
    }
  }
}

// 全局变量，用于存储当前悬停的节点
let currentHoverNode = null;

// 为节点添加鼠标事件
function addMouseEvents(node) {
  // 添加鼠标悬停事件
  node.on(
    cc.Node.EventType.MOUSE_ENTER,
    function (event) {
      // 设置当前悬停的节点
      currentHoverNode = node;

      // 停止事件冒泡
      event.stopPropagation();
    },
    this
  );

  // 添加鼠标离开事件
  node.on(
    cc.Node.EventType.MOUSE_LEAVE,
    function (event) {
      // 清除当前悬停的节点
      currentHoverNode = null;

      // 停止事件冒泡
      event.stopPropagation();
    },
    this
  );

  // 添加鼠标点击事件
  node.on(
    cc.Node.EventType.MOUSE_DOWN,
    function (event) {
      // 输出节点ID
      console.log("Clicked node ID:", node);

      // 停止事件冒泡
      event.stopPropagation();
    },
    this
  );
}

// 全局事件处理器
function globalEventHandler() {
  // 检查当前悬停的节点是否改变
  if (currentHoverNode) {
    // 显示节点边框
    drawNodeBorder(currentHoverNode, true);
  } else {
    // 隐藏节点边框
    borderGraphics.clear();
  }
}

// 添加全局事件处理器
cc.director.getScheduler().schedule(globalEventHandler, canvas, 0);

// 绘制节点边框
function drawNodeBorder(node, visible) {
  if (visible) {
    borderGraphics.clear();
    borderGraphics.strokeColor = cc.Color.RED;
    borderGraphics.lineWidth = 5;

    let rect = node.getBoundingBoxToWorld();
    let p1 = canvas.convertToNodeSpaceAR(rect.origin);
    let p2 = canvas.convertToNodeSpaceAR(cc.v2(rect.x + rect.width, rect.y));
    let p3 = canvas.convertToNodeSpaceAR(
      cc.v2(rect.x + rect.width, rect.y + rect.height)
    );
    let p4 = canvas.convertToNodeSpaceAR(cc.v2(rect.x, rect.y + rect.height));

    borderGraphics.moveTo(p1.x, p1.y);
    borderGraphics.lineTo(p2.x, p2.y);
    borderGraphics.lineTo(p3.x, p3.y);
    borderGraphics.lineTo(p4.x, p4.y);
    borderGraphics.close();
    borderGraphics.stroke();
  } else {
    borderGraphics.clear();
  }
}
setInterval(() => {
  // 开始遍历游戏中的所有节点
  traverseNode(canvas);
}, 200);
