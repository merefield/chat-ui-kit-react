import React, { useImperativeHandle, forwardRef, useRef } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { noop, allowedChildren } from "../utils";
import { SizeEnum, StatusEnum } from "../enums";
import Status from "../Status";
import { prefix } from "../settings";

function StatusListInner(
  { className, children, size, selected, onChange = noop, itemsTabIndex, ...rest },
  ref
) {
  const cName = `${prefix}-status-list`;

  const listRef = useRef();

  // Return object with public API
  useImperativeHandle(ref, () => ({
    focus: (idx) => {
      const items = Array.from(listRef.current.querySelectorAll("li"));
      const directChild = items.filter(
        (item) => item.parentNode === listRef.current
      );
      if (typeof directChild[idx] !== "undefined") {
        directChild[idx].focus();
      }
    },
  }));

  let tabIndex = itemsTabIndex;
  return (
    <ul
      ref={listRef}
      {...rest}
      className={classNames(cName, className, { [`${cName}--${size}`]: size })}
    >
      {React.Children.map(children, (item) => {
        const newProps = {};
        if (selected) {
          newProps.selected = item.props.status === selected;
        }

        if (onChange) {
          newProps.onClick = (evt) => {
            onChange(item.props.status);
            if (item.onClick) {
              item.onClick(evt);
            }
          };
        }

        const handleKeyPress = (evt) => {
          if (evt.key === "Enter") {
            onChange(item.props.status);
          }
        };

        const tIndex = (() => {
          if (typeof tabIndex === "number") {
            if (tabIndex > 0) {
              return tabIndex++;
            } else {
              return tabIndex;
            }
          } else {
            return undefined;
          }
        })();

        return (
          <li
            role="button"               // Add role for accessibility
            tabIndex={tIndex || 0}      // Make focusable
            onKeyPress={handleKeyPress} // Handle Enter key for keyboard accessibility
            onClick={newProps.onClick}  // Assign the onClick handler for mouse interactions
          >
            {React.cloneElement(item, newProps)}
          </li>
        );
      })}
    </ul>
  );
}

const StatusList = forwardRef(StatusListInner);
StatusList.displayName = "StatusList";

StatusList.propTypes = {
  children: allowedChildren([Status]),
  selected: PropTypes.oneOf(StatusEnum),
  size: PropTypes.oneOf(SizeEnum),
  itemsTabIndex: PropTypes.number,
  className: PropTypes.string,
  onChange: PropTypes.func,
};

StatusListInner.propTypes = StatusList.propTypes;

export { StatusList };
export default StatusList;
