import { defineComponent, PropType } from "vue";

const ELRate = defineComponent({
    name: "ELRate",
    props: {
        value: {
          type: Number,
          default: 0
        },
        lowThreshold: {
          type: Number,
          default: 2
        },
        highThreshold: {
          type: Number,
          default: 4
        },
        max: {
          type: Number,
          default: 5
        },
        colors: {
          type: [Array, Object],
          default() {
            return ["#F7BA2A", "#F7BA2A", "#F7BA2A"];
          }
        },
        voidColor: {
          type: String,
          default: "#C6D1DE"
        },
        disabledVoidColor: {
          type: String,
          default: "#EFF2F7"
        },
        iconClasses: {
          type: [Array, Object],
          default() {
            return ["el-icon-star-on", "el-icon-star-on", "el-icon-star-on"];
          }
        },
        voidIconClass: {
          type: String,
          default: "el-icon-star-off"
        },
        disabledVoidIconClass: {
          type: String,
          default: "el-icon-star-on"
        },
        disabled: {
          type: Boolean,
          default: false
        },
        allowHalf: {
          type: Boolean,
          default: false
        },
        showText: {
          type: Boolean,
          default: false
        },
        showScore: {
          type: Boolean,
          default: false
        },
        textColor: {
          type: String,
          default: "#1f2d3d"
        },
        texts: {
          type: Array,
          default() {
            return ["极差", "失望", "一般", "满意", "惊喜"];
          }
        },
        scoreTemplate: {
          type: String,
          default: "{value}"
        }
      },
  
    setup(){
        return () => {

        }
    },
})
export default ELRate