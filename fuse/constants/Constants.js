class Constants {
  static defaultFusejsThreshold = 0.2

  static FormTypes = {
    HEADER: 0,
    EDITTEXT_TEXT_SINGLELINE: 1,
    EDITTEXT_TEXT_MULTILINE: 2,
    EDITTEXT_NUMBER: 3,
    EDITTEXT_EMAIL: 4,
    EDITTEXT_PHONE: 5,
    EDITTEXT_PASSWORD: 6,
    PICKER_DATE: 7,
    PICKER_TIME: 8,
    PICKER_SINGLE: 9,
    PICKER_MULTI: 10,
    SWITCH: 11,
    LOCATION: 12,
    FILE: 13,
    PHOTO: 14,
    NOTE: 15,
    DUMMY_1: 16,
    DUMMY_2: 17,
    DUMMY_3: 18,
    DUMMY_4: 19,
    TABLE: 20,
    COUNTRY_DIVISION: 21,
    CASCADE: 22,
  }

  static FormTypesKeys = Object.keys(Constants.FormTypes)
}

export default Constants
