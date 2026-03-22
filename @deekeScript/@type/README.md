
### 说明

- Global.d.ts主要放一些全局的函数或者常量
- class主要是存储一些对象

> 应该说，DeekeScript设计中，暴露给外部的api主要通过这两种形式存在。

### 详细说明
#### 在class文件夹中的类全部是以下面的形式使用的：
```
App.currentPackageName();
```

#### 在Global.d.ts中，都是以下面的方式使用的：
```
//方式1
let a = UiSelector();
```