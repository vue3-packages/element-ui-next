import { kebabCase } from "../../src/utils/util";
import { onMounted, getCurrentInstance, onUnmounted, Ref} from "vue";

function migrating(): {
} {
  onMounted(() => {
    if (process.env.NODE_ENV === "production") return;
    const componentInternalInstance = getCurrentInstance()
    if (componentInternalInstance && !componentInternalInstance.vnode) return;
    const { props = {}, events = {} } = getMigratingConfig();
    const { data, componentOptions } = componentInternalInstance.vnode;
    const definedProps = data.attrs || {};
    const definedEvents = componentOptions.listeners || {};

    for (let propName in definedProps) {
      propName = kebabCase(propName); // compatible with camel case
      if (props[propName]) {
        console.warn(`[Element Migrating][${componentInternalInstance.options.name}][Attribute]: ${props[propName]}`);
      }
    }

    for (let eventName in definedEvents) {
      eventName = kebabCase(eventName); // compatible with camel case
      if (events[eventName]) {
        console.warn(`[Element Migrating][${componentInternalInstance.options.name}][Event]: ${events[eventName]}`);
      }
    }
  });
  const getMigratingConfig = () => {
    return {
      props: {},
      events: {},
    };
  }
  return {
  };
}

export default migrating;
