const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function testAggregate() {
  try {
    const maxRightResult = await prisma.comments.aggregate({
      where: { task_id: 17 }, // Giả sử rằng bạn muốn kiểm tra với task_id là 1
      _max: {
        comment_right: true,
      },
    });
    console.log("Giá trị Max Right là:", maxRightResult._max.comment_right);
  } catch (error) {
    console.error("Đã xảy ra lỗi khi thực hiện aggregate:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testAggregate();
