import eventBus, { IEventBus } from "../../../src/tools/eventBus";

function useEventBus(): IEventBus {
  return eventBus;
}

function useMenu(type: string, index?: string) {
  const items = [];
  return {
    items,
  };
}

export { useEventBus, useMenu };
