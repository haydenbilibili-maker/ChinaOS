import { createContext, useContext } from 'react';

/**
 * 当前模块上下文（Shell 提供）：{ mod, group, index, total }
 * 供卷首（PageHeader）显示分组、卷次与模块色，而不必让 ui.jsx 依赖注册表。
 */
export const ModuleContext = createContext(null);
export const useCurrentModule = () => useContext(ModuleContext);
