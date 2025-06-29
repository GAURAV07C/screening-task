"use client";

import { useState } from "react";
import { margin, operators, size } from "../data/operators.jsx";
import { Eye } from "lucide-react";

export default function Operator({
  itemId,
  fill,
  height,
  width,
  components,
  isCustom,
  symbol,
  style = {},
}) {
  const [isXRayMode, setIsXRayMode] = useState(false);

  // Calculate expanded width
  const minX = Math.min(...components.map((c) => c.x));
  const maxX = Math.max(...components.map((c) => c.x));
  const expandedWidth = (maxX - minX + 1) * (size + margin.x) - margin.x;
  const expandedHeight = Math.max(...components.map((c) => c.y)) + 1;

  return (
    <div style={{ ...style }} className="group relative">
      <svg
        className={`absolute top-0 left-0`}
        height={height * size + margin.y * (height - 1)}
        width={isXRayMode ? expandedWidth : size}
        overflow="visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        {!isXRayMode ? (
          // Normal gate box
          <>
            <rect
              fill={fill}
              height={height * size + (height - 1) * margin.y}
              rx="4"
              width={size}
              x="0"
              y="0"
            />
            {symbol}
          </>
        ) : (
          // X-Ray Mode View
          <>
            {/* Dotted border box */}
            <rect
              x="0"
              y="0"
              width={expandedWidth}
              height={expandedHeight * (size + margin.y) - margin.y}
              fill="#f9fafb"
              stroke="dodgerblue"
              strokeWidth="2"
              strokeDasharray="6,4"
              rx="6"
            />
            {/* Render components inside */}
            {components.map((c, i) => {
              const op = operators.find((o) => o.id === c.gateId);
              return (
                <g
                  key={i}
                  transform={`translate(${c.x * (size + margin.x)}, ${
                    c.y * (size + margin.y)
                  })`}
                >
                  <rect
                    fill={op.fill}
                    height={c.h * size + (c.h - 1) * margin.y}
                    rx="4"
                    width={size}
                  />
                  {op.icon}
                </g>
              );
            })}
          </>
        )}
      </svg>

      {/* X-Ray toggle button */}
      {isCustom && (
        <button
          aria-label="Toggle X-Ray Mode"
          className={`${
            !isXRayMode && "group-hover:block hidden"
          } absolute top-0 left-0 bg-white cursor-pointer border border-gray-300 z-50 rounded-full shadow`}
          onClick={(e) => {
            e.stopPropagation();
            setIsXRayMode(!isXRayMode);
          }}
          style={{ width: 18, height: 18, minWidth: 0, padding: 0 }}
        >
          <Eye size={14} color={isXRayMode ? "dodgerblue" : "black"} />
        </button>
      )}
    </div>
  );
}
