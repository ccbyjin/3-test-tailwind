import { idVerify } from "@/utils/idVerify.js";

const maliciousInputRegex = /[<>&'"\/]/; // 定義一個正則表達式來匹配惡意輸入的字符

const checkInput = (userData) => {
  // 檢查輸入是否包含惡意字符
  if (maliciousInputRegex.test(userData)) {
    // 如果包含惡意字符，則返回false，表示輸入無效
    return false;
  }
  // 如果不包含惡意字符，則返回true，表示輸入有效
  return true;
};

const checkUserInput = (userData) => {
  // 檢查輸入是否包含惡意字符
  const isSafeInput = checkInput(userData);
  if (!isSafeInput) {
    alert("身分證輸入包含惡意字符，請重新輸入");
    return false;
  }

  return true;
};

export { checkInput, checkUserInput };
