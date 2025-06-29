var validator = require("validator");

// do validation of user entered details
module.exports = {
  // check if the string contains only numbers.
  isNumber: function (data) {
    var isNumeric = validator.isNumeric(data.toString());
    return isNumeric;
  },
  // check if the object passed is null or not.
  isNullObject: function (data) {
    var isNullObject = false;
    if (typeof data === "undefined") {
      data = null;
    }
    if (data === undefined) {
      data = null;
    }
    if (data === "null") {
      data = null;
    }
    if (data === "[]") {
      data = null;
    }
    if (data === null) {
      isNullObject = true;
    }
    if (!isNullObject) {
      if (data.length === 0) {
        isNullObject = true;
      }
    }
    return isNullObject;
  },
  // check if the string is null.
  isNull: function (data) {
    var isNull = validator.isNull(data);
    if (!isNull) {
      if (data === "null") {
        isNull = true;
      }
    }
    return isNull;
  },
  // check if the string is null or empty.
  isNullOrEmpty: function (data) {
    var isNull = false;
    if (data === null) {
      isNull = true;
    }
    if (data === "null") {
      isNull = true;
    }
    if (data === undefined) {
      isNull = true;
    }
    if (data === "undefined") {
      isNull = true;
    }
    if (typeof data === undefined) {
      isNull = true;
    }
    if (typeof data == "undefined") {
      isNull = true;
    }
    // check for null
    if (!isNull) {
      isNull = validator.isEmpty(data.toString());
      if (!isNull) {
        if (data === "null") {
          isNull = true;
        }
      }
    }
    // check for empty string
    if (!isNull) {
      isNull = validator.matches(data.toString(), /(^\s{\w})+/);
      if (!isNull) {
        if (data == "''") {
          isNull = true;
        }
        if (!isNull) {
          if (data == "") {
            isNull = true;
          }
        }
      }
    }
    return isNull;
  },
  // check if a string is a boolean.
  isBoolean: function (data) {
    var isBoolean = validator.isBoolean(data);
    return isBoolean;
  },
  // check if the string is an email.
  // options is an object which defaults to { allow_display_name: false, allow_utf8_local_part: true, require_tld: true }.
  // If allow_display_name is set to true, the validator will also match Display Name <email-address>.
  // If allow_utf8_local_part is set to false, the validator will not allow any non-English UTF8 character in email address' local part.
  // If require_tld is set to false, e-mail addresses without having TLD in their domain will also be matched.
  isEmail: function (data) {
    var isEmail = validator.isEmail(data);
    return isEmail;
  },
  // check if the string is a float.
  // options is an object which can contain the keys min and/or max to validate the float is within boundaries (e.g. { min: 7.22, max: 9.55 }).
  isFloat: function (data) {
    var isFloat = validator.isFloat(data);
    return isFloat;
  },
  // isAlphanumeric(str [, locale])
  // check if the string contains only letters and numbers.
  // Locale is one of ['en-US', 'de-DE', 'es-ES', 'fr-FR', 'nl-NL', 'pt-PT', 'en-AU', 'en-GB', 'en-HK', 'en-IN', 'en-NZ', 'en-ZA', 'en-ZM']) and defaults to en-US.
  isAlphanumeric: function (data) {
    var isAlphanumeric = validator.isAlphanumeric(data);
    return isAlphanumeric;
  },
  // check if the string contains ASCII chars only.
  isAscii: function (data) {
    var isAscii = validator.isAscii(data);
    return isAscii;
  },
  // check if a string is base64 encoded.
  isBase64: function (data) {
    var isBase64 = validator.isBase64(data);
    return isBase64;
  },
  // check if the string is a credit card.
  isCreditCard: function (data) {
    var isCreditCard = validator.isCreditCard(data);
    return isCreditCard;
  },
  // check if the string is a valid currency amount.
  // options is an object which defaults to
  // {symbol: '$', require_symbol: false, allow_space_after_symbol: false, symbol_after_digits: false, allow_negatives: true,
  //               parens_for_negatives: false, negative_sign_before_digits: false, negative_sign_after_digits: false,
  //               allow_negative_sign_placeholder: false, thousands_separator: ',', decimal_separator: '.', allow_space_after_digits: false }.
  isCurrency: function (data) {
    var isCurrency = validator.isCurrency(data);
    return isCurrency;
  },
  // check if the string is a date.
  isDate: function (data) {
    // format yyyy[/.-]mm[/.-]dd hh:mm:ss
    var datePattern =
      /^((((19|[2-9]\d)\d{2})[\/\.-](0[13578]|1[02])[\/\.-](0[1-9]|[12]\d|3[01])\s(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]))|(((19|[2-9]\d)\d{2})[\/\.-](0[13456789]|1[012])[\/\.-](0[1-9]|[12]\d|30)\s(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]))|(((19|[2-9]\d)\d{2})[\/\.-](02)[\/\.-](0[1-9]|1\d|2[0-8])\s(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))[\/\.-](02)[\/\.-](29)\s(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])))$/g;
    var isDate = validator.matches(data, datePattern);
    return isDate;
  },
  // check if the string is a date and it matches the date format passed.
  isDateFormatMatched: function (data, dateFormat) {
    // enter the different type of date separators
    var dateFormatSeparator = ["/", "-", "."];
    //
    var datePattern = [];
    var dateFormatSplit = [];

    var isDate = false;
    var enteredDateManip = false;
    var datePart;
    var monthPart;
    var yearPart;
    var datePatternExp = "";

    // check which format is specified in the dateFormat parameter that is passed
    for (var count = 0; count < dateFormatSeparator.length; count++) {
      datePattern = data.split(dateFormatSeparator[count]);
      dateFormatSplit = dateFormat.split(dateFormatSeparator[count]);

      // if the date format passed is correct,
      // then it will contain 3 entries when we split based on the date seperator
      if (datePattern.length == 3 && dateFormatSplit.length == 3) {
        enteredDateManip = true;
        // get the day, month and year
        for (var formatCnt = 0; formatCnt < 3; formatCnt++) {
          var dateFormatName = dateFormatSplit[formatCnt];
          if (
            dateFormatName.toLowerCase() == "dd" ||
            dateFormatName.toLowerCase() == "d"
          ) {
            datePart = parseInt(datePattern[formatCnt]);
            if (datePart < 1) {
              // if the date is 0 or less than that, return value indicating date is invalid
              return false;
            }
          } else if (
            dateFormatName.toLowerCase() == "mm" ||
            dateFormatName.toLowerCase() == "m"
          ) {
            monthPart = parseInt(datePattern[formatCnt]);
            if (monthPart < 1) {
              // if the date is 0 or less than that, return value indicating date is invalid
              return false;
            }
          } else if (
            dateFormatName.toLowerCase() == "yyyy" ||
            dateFormatName.toLowerCase() == "yy"
          ) {
            yearPart = parseInt(datePattern[formatCnt]);
          }
        }

        for (var formatCnt = 0; formatCnt < 3; formatCnt++) {
          var dateFormatName = dateFormatSplit[formatCnt];
          // day validation
          if (
            dateFormatName.toLowerCase() == "dd" ||
            dateFormatName.toLowerCase() == "d"
          ) {
            if (monthPart == 2) {
              // if february
              if (yearPart % 4 == 0) {
                // if leap year
                if (datePart > 29) {
                  // no of days will be 29
                  return false;
                }
                datePatternExp +=
                  "([0-2]?[0-9]{1})" + dateFormatSeparator[count];
              } else {
                if (datePart > 28) {
                  // not leap year and month is february, no of days will be 28
                  return false;
                }
                datePatternExp +=
                  "([0-2]?[0-8]{1})" + dateFormatSeparator[count];
              }
            } else if (
              monthPart == 4 ||
              monthPart == 6 ||
              monthPart == 9 ||
              monthPart == 11
            ) {
              if (datePart > 30) {
                // if month is april, june, september or november, no of days will be 30
                return false;
              }
              datePatternExp += "([0-3]?[0-9]{1})" + dateFormatSeparator[count];
            } else {
              if (datePart > 31) {
                /// if no of days for rest of the month is
                return false;
              }
              datePatternExp += "([0-3]?[0-9]{1})" + dateFormatSeparator[count];
            }
          } else if (
            dateFormatName.toLowerCase() == "mm" ||
            dateFormatName.toLowerCase() == "m"
          ) {
            // month validation
            if (monthPart > 12) {
              return false;
            }
            datePatternExp += "([0,1]?[0-9]{1})" + dateFormatSeparator[count];
          } else if (
            dateFormatName.toLowerCase() == "yyyy" ||
            dateFormatName.toLowerCase() == "yy"
          ) {
            datePatternExp +=
              "(\\d){" +
              dateFormatName.length +
              "}" +
              dateFormatSeparator[count];
          }
        }
        datePatternExp = datePatternExp.slice(0, -1);
      }
    }
    if (!enteredDateManip) {
      return false;
    }
    var isDate = validator.matches(data, datePatternExp); ///^([0-3]?[0-9]{1})-([0,1]?[0-9]{1})-(\d){4}$/
    return isDate;
  },
  // check if the string represents a decimal number, such as 0.1, .3, 1.1, 1.00003, 4.0, etc.
  isDecimal: function (data) {
    var isDecimal = validator.isDecimal(data);
    return isDecimal;
  },
  // check if the string is valid JSON (note: uses JSON.parse).
  isJSON: function (data) {
    var isJSON = validator.isJSON(data);
    return isJSON;
  },
  // isURL(str [, options])
  // check if the string is an URL.
  // options is an object which defaults to { protocols: ['http','https','ftp'],
  // require_tld: true, require_protocol: false, require_valid_protocol: true, allow_underscores: false,
  // host_whitelist: false, host_blacklist: false, allow_trailing_dot: false, allow_protocol_relative_urls: false }.
  isURL: function (data) {
    var isURL = validator.isURL(data);
    return isURL;
  },
  // isBefore(str [, date])
  // check if the string is a date that's before the specified date.
  isBefore: function (data) {
    var isBefore = validator.isBefore(data);
    return isBefore;
  },
  // isIn(str, values)
  // check if the string is in a array of allowed values.
  isIn: function (data, collection) {
    var isIn = validator.isIn(data, collection);
    return isIn;
  },
  // isInt(str [, options])
  // check if the string is an integer.
  // options is an object which can contain the keys min and/or max to check the integer is within boundaries
  // (e.g. { min: 10, max: 99 }).
  isInt: function (data) {
    var isInt = validator.isInt(data);
    return isInt;
  },
  escapeHtml: function (data) {
    return data ? data.replace(/[&<>"'\/`\\]/g, function(match) {
      switch (match) {
          case '&':
              return '&amp;';   // Ampersand
          case '<':
              return '&lt;';    // Less than
          case '>':
              return '&gt;';    // Greater than
          case '"':
              return '&quot;';  // Double quote
          case "'":
              return '&#39;';    // Single quote
          case '/':
              return '&#47;';     // Forward slash
          case '`':
              return '&#96;';     // Backtick
          case '\\':
              return '&#92;';     // Backslash
      }
  }) : data;
  },
};
