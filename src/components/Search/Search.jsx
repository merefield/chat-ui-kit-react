import React, {
  useState,
  useRef,
  useMemo,
  useImperativeHandle,
  forwardRef,
} from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { prefix } from "../settings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const useControlledOrNot = (initialValue, value) => {
  const [internalValue, setInternalValue] = useState(initialValue);

  const isControlled = typeof value !== "undefined";
  const actualValue = isControlled ? value : internalValue;

  const setValue = isControlled ? () => {} : setInternalValue;

  return [actualValue, setValue, isControlled];
};

function SearchInner(
  {
    placeholder = "",
    value = undefined,
    onChange = () => {},
    onClearClick = () => {},
    className,
    disabled = false,
    ...rest
  },
  ref
) {
  const cName = `${prefix}-search`;

  const [searchValue, setSearchValue, isControlled] = useControlledOrNot(
    "",
    value
  );

  const [clearActive, setClearActive] = useState(
    isControlled ? searchValue.length > 0 : false
  );

  useMemo(() => typeof value !== "undefined", [value]);

  if (isControlled !== (typeof value !== "undefined")) {
    throw new Error(
      "Search: Changing from controlled to uncontrolled component and vice versa is not allowed"
    );
  }

  const inputRef = useRef(undefined);

  // Public API
  const focus = () => {
    if (typeof inputRef.current !== "undefined") {
      inputRef.current.focus();
    }
  };

  // Return object with public Api
  useImperativeHandle(ref, () => ({
    focus,
  }));

  const handleChange = (e) => {
    const value = e.target.value;
    setClearActive(value.length > 0);
    if (!isControlled) {
      setSearchValue(value);
    }
    onChange(value);
  };

  const handleClearClick = () => {
    if (!isControlled) {
      setSearchValue("");
    }
    setClearActive(false);
    onClearClick();
  };

  return (
    <div
      {...rest}
      className={classNames(
        cName,
        { [`${cName}--disabled`]: disabled },
        className
      )}
    >
      <FontAwesomeIcon icon={faSearch} className={`${cName}__search-icon`} />
      <input
        ref={inputRef}
        type="text"
        className={`${cName}__input`}
        placeholder={placeholder}
        onChange={handleChange}
        disabled={disabled}
        value={searchValue}
      />
      <FontAwesomeIcon
        icon={faTimes}
        className={classNames(`${cName}__clear-icon`, {
          [`${cName}__clear-icon--active`]: clearActive,
        })}
        onClick={handleClearClick}
      />
    </div>
  );
}

const Search = forwardRef(SearchInner);

Search.displayName = "Search";

Search.propTypes = {
  /** Placeholder. */
  placeholder: PropTypes.string,

  /** Current value of the search input. Creates a controlled component */
  value: PropTypes.string,

  /** OnInput handler. */
  onChange: PropTypes.func,

  /** OnClearClick handler. */
  onClearClick: PropTypes.func,

  /** Additional classes. */
  className: PropTypes.string,

  /** Disabled */
  disabled: PropTypes.bool,
};

SearchInner.propTypes = Search.propTypes;

export { Search };
export default Search;
