const { BadRequestError } = require("../core/error.response");

async function buildWhereClause({ filterField, operator, value }) {
  function parseToNumber(value) {
    const num = parseFloat(value);
    if (isNaN(num)) {
      throw new BadRequestError("Expected a numeric value.");
    }
    return num;
  }
  //Nếu điều kiện Lọc nằm trong những cái dưới đây thì chuyển thành Số
  const numericFields = new Set([
    "updated_by", // Thêm trường này nếu là ID người dùng
    "created_by", // Thêm trường này nếu là ID người dùng
    "department_id",
  ]);
  if (numericFields.has(filterField)) {
    value = parseToNumber(value);
  }

  function parseBoolean(value) {
    if (value === "true" || value === true) {
      return true;
    } else if (value === "false" || value === false) {
      return false;
    }
    throw new BadRequestError("Invalid boolean value. Use 'true' or 'false'.");
  }
  let where = { AND: [] };
  if (!filterField || !operator || value === undefined || value === null) {
    // Thay vì ném lỗi, trả về một điều kiện trống để không lọc gì cả
    return {};
  }
  //
  if (filterField === "status" && (value === "true" || value === "false")) {
    value = parseBoolean(value);
    if (value === null) {
      throw new BadRequestError(
        "Invalid boolean value. Use 'true' or 'false'."
      );
    }
  }

  //

  if (filterField.endsWith("time")) {
    // Chuyển đổi giá trị thành đối tượng Date
    value = new Date(value);
  } else if (filterField.endsWith("id")) {
    // Đảm bảo giá trị là một số nguyên nếu trường là ID hoặc status
    value = parseInt(value);
  }

  switch (operator) {
    case "contains":
      where[filterField] = { contains: value, mode: "insensitive" };
      break;
    case "equals":
      where[filterField] = { equals: value };
      break;
    case "gte":
      where[filterField] = { gte: value };
      break;
    case "lte":
      where[filterField] = { lte: value };
      break;
    case "=":
      where[filterField] = { equals: value };
      break;
    case ">=":
      where.AND.push({ [filterField]: { gte: value } });
      break;
    case "<":
      where.AND.push({ [filterField]: { lt: value } });
      break;
    case "<=":
      where.AND.push({ [filterField]: { lte: value } });
      break;
    default:
      throw new BadRequestError(`Unsupported operator: ${operator}`);
  }
  return where;
}

module.exports = {
  buildWhereClause,
};
