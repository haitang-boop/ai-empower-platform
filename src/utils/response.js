/**
 * 统一响应格式工具
 */

function success(data, message = 'success') {
  return {
    code: 200,
    data,
    message
  };
}

function error(message = '服务器错误', code = 500) {
  return {
    code,
    message
  };
}

function badRequest(message = '请求参数错误') {
  return error(message, 400);
}

function unauthorized(message = '未登录或登录已过期') {
  return error(message, 401);
}

function forbidden(message = '没有权限访问') {
  return error(message, 403);
}

function notFound(message = '资源不存在') {
  return error(message, 404);
}

function serverError(message = '服务器内部错误') {
  return error(message, 500);
}

module.exports = {
  success,
  error,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  serverError
};