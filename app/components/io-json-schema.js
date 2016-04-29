import Ember from 'ember';

export default Ember.Component.extend({
  tagName: "div",

  // template
  schema: {},

  action: null,
  // 响应外部的按钮时间
  submitEvent: null,
  readonly: null,

  labelColClass: "col-8",
  inputColClass: "col-14",

  schemaTypes: [
      {name: "对象", value:"object"},
      {name: "数组", value:"array"}
  ],

  fieldTemplate: {
    name: null,
    description: null,
    type: "string",
    properties: [],
  },

  propertyTemplate: {
    name: null,
    value: null,
  },

  propertyType: [
    {name: "是否必填", value: "required", type: "boolean"},
    {name: "默认值", value: "default"},
    {name: "格式化", value: "format"},
    {name: "正则匹配", value: "pattern"},
    {name: "最大值", value: "maximum"},
    {name: "是否含最大值", value: "exclusiveMaximum", type: "boolean"},
    {name: "最小值", value: "minimum"},
    {name: "是否含最小值", value: "exclusiveMinimum", type: "boolean"},
    {name: "最大长度", value: "maxLength"},
    {name: "最小长度", value: "minLength"},
  ],

  types: [
      {name: "字符串", value:"string"},
      {name: "整数", value:"integer"},
      {name: "浮点数", value:"float"},
      {name: "布尔值", value:"boolean"},
      {name: "对象", value:"object"},
      {name: "数组", value:"array"}
  ],

  submit: {
      text: "保存",
      submitClass: "submit-button"
  },

  changeSet() {
  },

  reset() {
    this.setProperties({
      properties: null,
      data: null,
      ordered: null,
      action: null,
      submitEvent: null,
      labelColClass: null,
      inputColClass: null
    });
  },

  formToJSONSchema(data) {
    if (!data) {
      data = {
        title: "Example Schema",
        description: "Description",
        type: "object",
        properties: [
          {
            name: "name",
            type: "string"
          },
          {
            name: "age",
            type: "integer",
            properties: [
              {
                name: "minimum",
                value: 0
              }
            ]
          }
        ]
      };
    }

    var schema = {
      title: data.title,
      description: data.description,
      type: data.type,
      properties: {}
    };

    data.properties.forEach(function(property){
      var prop = {
        type: property.type,
      };
      if (property.properties) {
        property.properties.forEach(function(p){
          prop[p.name] = p.value;
        });
      }
      schema.properties[property.name] = prop;
    });

    return schema;
  },

  JSONSchemaToForm(data) {
    if (!data) {
      data = {
        "title": "Example Schema",
        "description": "Description",
        "type": "object",
        "properties": {
          "name": {
            "type": "string"
          },
          "age": {
            "description": "Age in years",
            "type": "integer",
            "minimum": 0
          }
        },
        "required": ["name"]
      };
    }

    var properties = [];
    var keys = Object.keys(data.properties);
    keys.forEach(function(key){
      var property = data.properties[key];
      var ks = Object.keys(property);
      var props = [];
      var type = null;
      var description = null;
      ks.forEach(function(k){
        if (k === "type") {
          type = property[k];
          return;
        }
        if (k === "description") {
          description = property[k];
          return;
        }
        props.push({name: k, value:property[k]});
      });

      properties.push({
        name: key, 
        type: type, 
        description: description, 
        properties: props
      });
    });
    console.log("Properties By Items");
    console.log(properties);

    this.set("schema", {
      title: data.title,
      type: data.type,
      properties: properties
    });
  },

  actions: {
    addField: function() {
      console.log("FOO");
      var properties = this.get("schema.properties");
      console.log(properties);
      properties.pushObject(this.get("fieldTemplate"));
    },
    addProperty: function(index) {
      var properties = this.get("schema.properties");
      properties[index].properties.pushObject(this.get("propertyTemplate"));
    },
    save: function() {
      console.log("Orignal Data:");
      console.log(this.schema);
      console.log("JSON Schame Data:");
      console.log(this.formToJSONSchema(this.schema));
    },
  },

  didInsertElement() {
    this.JSONSchemaToForm();
  },

  didUpdateAttrs() {
    this._super(...arguments);
    this.changeSet();
  },

  willDestroyElement() {
  }
});
