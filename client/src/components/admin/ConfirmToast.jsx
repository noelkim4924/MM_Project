// ConfirmToast.jsx
import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

/**
 * ConfirmToast
 * - "type" prop: "verify" or "decline"
 * - "message": 표시할 메시지
 * - "onConfirm", "onCancel": 버튼 클릭 시 동작
 */
function ConfirmToast({ type, message, onConfirm, onCancel }) {
  // type에 따라 색상, 아이콘 다르게
  let borderColor = "border-green-500";
  let textColor = "text-green-500";
  let IconComponent = CheckCircle;

  if (type === "decline") {
    borderColor = "border-red-500";
    textColor = "text-red-500";
    IconComponent = XCircle;
  }

  return (
    <div
      className={`
        fixed top-6 left-1/2 transform -translate-x-1/2
        bg-white border-l-4 ${borderColor}
        rounded-md px-6 py-4 shadow-md z-50
        flex items-start space-x-3
        w-[400px]  // 박스 폭을 400px 정도로 키움
      `}
    >
      {/* 아이콘 영역 */}
      <div className={`mt-1 ${textColor}`}>
        <IconComponent size={24} />
      </div>

      {/* 텍스트 + 버튼들 */}
      <div className="flex flex-col text-base text-gray-800">
        <span>{message}</span>
        <div className="mt-3 flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md text-sm bg-gray-300 hover:bg-gray-400 text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`
              px-4 py-2 rounded-md text-sm text-white
              ${type === "decline"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
              }
            `}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmToast;
