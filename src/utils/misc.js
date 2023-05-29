import * as Validator from './validator';

/**@description 判断两个对象的某些字段的一致性 */
export function validateFileds(source, target, ...fileds) {
  fileds = fileds.flat();
  return fileds.reduce((pre, curF) => {
    return pre && source[curF] === target[curF];
  }, true);
}

/**@description 根据给出的字段，移除数组中的重复元素 */
export function arrayDupRemove(array, ...keyFileds) {
  keyFileds = keyFileds.flat();
  return array.reduce((pre, curr) => {
    if (keyFileds.length) {
      if (pre.findIndex(n => validateFileds(n, curr, keyFileds)) > -1) {
        return pre;
      } else {
        return pre.concat(curr);
      }
    } else {
      if (pre.include(curr)) {
        return pre;
      } else {
        return pre.concat(curr);
      }
    }
  }, []);
}

/**@description 在timeout的时间内，轮询获取一个元素或实例 */
export function requestDom(
  id,
  judgeCb = el => Boolean(el),
  type = 'requestAnimationFrame',
  timer = 300,
  timeOut = 3000
) {
  function getDom(id, callback, type) {
    if (document && window) {
      const el = typeof id === 'string' ? document.getElementById(id) : id();
      if (!judgeCb(el)) {
        if (type === 'requestAnimationFrame') {
          requestAnimationFrame(() => {
            getDom(id, callback, type);
          });
        }
        if (type === 'setTimeout') {
          setTimeout(() => {
            getDom(id, callback, type);
          }, timer);
        }
        if (type === 'requestIdleCallback') {
          requestIdleCallback(
            () => {
              getDom(id, callback, type);
            },
            { timeout: timer }
          );
        }
      } else {
        return callback(el);
      }
    }
    else {
      throw Error("browser don't support");
    }
  }

  return new Promise((resolve, reject) => {
    setTimeout(reject, timeOut);
    getDom(id, resolve, type);
  });
}

/**@description pick一些对象的某些字段值 */
export function pickFileds(target, ...fileds) {
  if (!target) return {};
  const f = fileds.flat();
  if (f.length === 0) return target;
  return pickAttrs(target, key => key, f);
}

/**@description 根据key去除数组中的一些元素 */
export function arrayOmit(array, omits, uniqueKey = 'id') {
  return array.filter(
    pipe => omits.findIndex(p => p[uniqueKey] === pipe[uniqueKey]) === -1
  );
}

/**@description forEach Picks数组的元素从raw中找到元素，并传入回调 */
export function rawForEach(raws, picks, cb, uniqueKey = 'id') {
  picks &&
    picks.forEach(pipe => {
      if (cb) {
        cb(raws.find(p => p[uniqueKey] === pipe[uniqueKey]));
      }
    });
}

/**@description 从picks中映射为raw中的元素，不存则映射为原来的值 */
export function rawMap(picks, raws, uniqueKey) {
  return picks.map(
    p => raws.find(raw => raw[uniqueKey] === p[uniqueKey]) || p
  );
}

/**@description 根据key合并数组中的元素 */
export function arrayMerge(uniqueKey, ...arrays) {
  arrays = arrays.flat();
  return arrayDupRemove(arrays, uniqueKey);
}

/**@description 将单个元素转为对象 */
export function toArray(tar) {
  if (Array.isArray(tar)) {
    return tar;
  } else {
    return [tar];
  }
}

/**@description 更新list中某个字段等于value的元素 */
export function replaceFiledItems(list, filedKey, filedValue, tars) {
  return list.filter(p => p[filedKey] != filedValue).concat(tars);
}

/**@description 设置一个ctx中的某些字段值，支持.访问符 */
export function getCtxValueSetter(ctx, filedLike) {
  const fileds = filedLike.split('.');
  const length = fileds.length;
  return value => {
    let context = ctx;
    fileds.forEach((val, index) => {
      if (index < length - 1) {
        context = context[val];
      } else {
        context[val] = value;
      }
    });
  };
}

/**@description 获取一个ctx中的某一字段值，支持.访问符 */
export function getCtxValue(ctx, filedLike) {
  const fileds = filedLike.split('.');
  let val = ctx;
  fileds.forEach(key => {
    val = val[key];
  });
  return val;
}

/**@description bindLoading函数 */
export function bindLoading(loadingFiled, loadingFn, beforeExec, afterExec) {
  if (!loadingFn) {
    throw Error('bindLoading error, callback is null');
  }
  const setValue = getCtxValueSetter(this, loadingFiled);
  return async (...params) => {
    beforeExec && beforeExec(...params);
    setValue(true);
    try {
      const result = await loadingFn.call(this, ...params);
      setValue(false);
      afterExec && afterExec(result);
      return result
    } catch (error) {
      afterExec && afterExec(error);
      setValue(false);
      return error;
    }
  };
}

/**@description 统计数组中某个字段的值的出现频率 */
export function statisticFiled(array, Filed, resultType = 'array') {
  if (
    !Array.isArray(array) ||
    !Filed ||
    ['array', 'obj', 'object'].indexOf(resultType) === -1
  ) {
    throw Error('statisticFiled params error');
  }
  const isArray = resultType === 'array';
  return array.reduce((pre, cur) => {
    const preVal = isArray
      ? pre.find(i => i[0] === cur[Filed])
      : pre[cur[Filed]];
    if (preVal) {
      if (isArray) {
        const preIndex = pre.findIndex(item => item[0] === cur[Filed]);
        pre[preIndex][1].push(cur);
      } else {
        pre[cur[Filed]].push(cur);
      }
    }
    else {
      if (isArray) {
        pre.push([cur[Filed], [cur]]);
      } else {
        pre[cur[Filed]] = [cur];
      }
    }
    return pre;
  }, isArray ? [] : {});
}

/**@description 判断数组中每个元素的某个filed值是否相同 */
export function reduceFiledEqual(array, filed = 'id') {
  if (Array.isArray(array) && array.length > 0) {
    return array.slice(1).reduce((pre, cur) => {
      if (cur[filed] === pre[0]) {
        return pre;
      } else {
        return [false, false];
      }
    }, [array[0][filed], true])[1];
  } else {
    return false;
  }
}

/**@description 拾取对象中某些字段的值 */
export function pickAttrs(obj, prefix = val => val, ...attrs) {
  attrs = attrs.flat();
  return attrs.reduce((pre, cur) => {
    return {
      ...pre,
      [prefix(cur)]: obj[cur],
    };
  }, {});
}

/**@description 统计一个数组中，某一个字段出现的元素信息 */
export function statisticArray(array, sFiled = 'id') {
  return array.reduce((pre, curr) => {
    const fVal = curr[sFiled];
    return {
      ...pre,
      [fVal]: pre[fVal] ? pre[fVal].concat(curr) : [curr],
    };
  }, {});
}

/**@description debounce函数 */
export function debounce(fn, timeGutter = 300, immediate = false) {
  let timer;
  return function(...params) {
    if (!timer) {
      timer = setTimeout(() => {
        fn(...params);
        timer = void 0;
      }, timeGutter);
      if (immediate) {
        fn(...params);
      }
    } else {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn(...params);
        timer = null;
      });
    }
  };
}

/**
 * !警告,该函数的返回函数不可打印执行
 * @description
 * @param {*} mergeFiled
 * @param {*} statisticKey
 * @returns
 */
export function createTableSpanMethods(mergeFiled, statisticKey) {
  let mergeRecord = null;
  let mergeRecordClear = null;
  let mergeStatistic = null;
  let mergeStatisticClear = null;
  statisticKey = statisticKey || mergeFiled;
  const isA = Array.isArray(mergeFiled);
  if (!isA) {
    return function(scope, tableData) {
      const { row, column } = scope;
      //判断字段是否已被合并
      if (!mergeRecord) {
        mergeRecord = {};
        mergeRecordClear = debounce(() => {
          mergeRecord = null;
        }, 1000);
      }
      else {
        mergeRecordClear();
      }
      //判断是否完成统计
      if (!mergeStatistic) {
        mergeStatistic = statisticArray(tableData, statisticKey);
        mergeStatisticClear = debounce(() => {
          mergeStatistic = null;
        }, 1000);
      }
      else {
        mergeStatisticClear();
      }
      // 处理合并字段
      if (column.property === mergeFiled) {
        if (!mergeRecord[row[statisticKey]]) {
          mergeRecord[row[statisticKey]] = true;
          return {
            rowspan: mergeStatistic[row[statisticKey]].length,
            colspan: 1,
          };
        }
        else {
          return {};
        }
      }
    };
  }
  else {
    return function(scope, tableData) {
      const { row, column } = scope;
      //判断字段是否已被合并
      if (!mergeRecord) {
        mergeRecord = {};
        mergeRecordClear = debounce(() => {
          mergeRecord = null;
        }, 1000);
      }
      else {
        mergeRecordClear();
      }
      //判断表是否完成统计
      if (!mergeStatistic) {
        mergeStatistic = statisticArray(tableData, statisticKey);
        mergeStatisticClear = debounce(() => {
          mergeStatistic = null;
        }, 1000);
      }
      else {
        mergeStatisticClear();
      }
      // 处理合并字段
      if (mergeFiled.includes(column.property)) {
        if (
          !mergeRecord[row[statisticKey]] ||
          !mergeRecord[row[statisticKey]].includes(column.property)
        ) {
          if (!mergeRecord[row[statisticKey]]) {
            mergeRecord[row[statisticKey]] = [column.property];
          }
          else {
            mergeRecord[row[statisticKey]].push(column.property);
          }
          return {
            rowspan: mergeStatistic[row[statisticKey]].length,
            colspan: 1,
          };
        }
        else {
          return {};
        }
      }
    };
  }
}

/**@description 返回了一个得到每个Item[filedKey]唯一对应的值的函数，fallback为生成对应值的函数 */
export function createFiledRecordCtx(fallback, filedKey) {
  const ctx = {};
  if (typeof fallback === 'string') {
    switch (fallback) {
      case 'randomColor': {
        fallback = randomColor;
        break;
      }
    }
  }

  return function(filedKeyOrItem, isGetCtx = false) {
    if (isGetCtx) {
      return ctx;
    }
    if (!filedKey) {
      if (!ctx[filedKeyOrItem]) {
        ctx[filedKeyOrItem] = fallback();
        return ctx[filedKeyOrItem];
      } else {
        return ctx[filedKeyOrItem];
      }
    } else {
      if (!ctx[filedKeyOrItem[filedKey]]) {
        ctx[filedKeyOrItem[filedKey]] = fallback();
        return ctx[filedKeyOrItem[filedKey]];
      } else {
        return ctx[filedKeyOrItem[filedKey]];
      }
    }
  };
}

/**@description 获取一个HEX格式的随机颜色 */
export function randomColor() {
  return (
    '#' +
    ('00000' + ((Math.random() * 0x1000000) << 0).toString(16)).substr(-6)
  );
}

/**@description 映射数组中的每个object的某个filed值,支持使用.访问符 */
export function mergeFiled(array, filedLike) {
  return array.map(item => getCtxValue(item, filedLike)).flat();
}

/**@description 创建两个数组的历史对照 */
export function createArrayContrast(raw, ...contrastFiled) {
  let history = raw || [];
  contrastFiled = contrastFiled.flat();
  return function contrast(curr) {
    const isAdd = curr.length > history.length;
    let list = [];
    if (isAdd) {
      list = curr.filter(
        cur =>
          history.findIndex(his => validateFileds(cur, his, contrastFiled)) === -1
      );
    }
    else {
      list = history.filter(
        cur =>
          curr.findIndex(his =>
            validateFileds(cur, his, contrastFiled)) === -1
      );
    }
    history = curr;
    return {
      isAdd: isAdd,
      list: list,
    };
  };
}

/**@description 获取一个树状 结构的travel函数 */
export function getTreeTraveler(visitor, childrenKey = 'children') {
  const { firstEnter, every } = visitor || {};
  return target => {
    function travel(tar, isFirst = true) {
      if (isFirst) {
        firstEnter && firstEnter(tar);
      }
      if (Array.isArray(tar)) {
        tar.forEach(element => {
          travel(element, false);
        });
      }
      else if (typeof tar === 'object') {
        every && every(tar);
        if (tar[childrenKey] && tar[childrenKey].length) {
          travel(tar[childrenKey], false);
        }
      }
    }
    travel(target);
  };
}

/**@description 获取一个对象递归的traveler函数 */
export function getObjectTraveler(visitor, maxDepth = 3) {
  const { every } = visitor || {};
  return target => {
    const result = {};
    function travel(object, res, depth = 1) {
      if (depth < maxDepth) {
        for (const key in object) {
          const isTravel = every && every(key, object[key], res);
          const tar = object[key];
          if (Array.isArray(tar) && isTravel) {
            res[key] = res[key] || [];
            tar.forEach(element => travel(element, res[key], depth + 1));
          }
          else if (typeof tar === 'object' && isTravel) {
            res[key] = res[key] || {};
            travel(tar, res[key], depth + 1);
          }
        }
      }
    }
    travel(target, result);
    return result;
  };
}

/**@description 通过URL下载文件 */
export function downloadURL(url, name = '默认名称') {
  const link = document.createElement('a');
  link.download = name;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**@description OBj 映射 */
export function objMap(obj, cb) {
  const res = {}
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const element = obj[key];
      res[key] = (cb && cb(key, element) || res[key]);
    }
  }
  return res;
}

/**@description once */
export function once(id, callback) {
  if (id) return id;
  const _id = Math.random();
  callback && callback();
  return _id;
}


export function encode(str) {
  // 对字符串进行编码
  // const encode = encodeURI(encodeURIComponent(str));
  const encode = encodeURI((str));
  // 对编码的字符串转化base64
  const base64 = btoa(encode);
  return base64;
}

export function decode(base64) {
  // 对base64转编码
  const decode = atob(base64);
  // 编码转字符串
  // const str = decodeURIComponent(decodeURI(decode));
  const str = (decodeURI(decode));
  return str;
}


/**
 *
 * @param {string} dateString
 */
export function matchTime(date) {
  return date?.match(/^\d{4}([/:-_\S])(1[0-2]|0?[1-9])([/:-_\S])(0?[1-9]|[1-2]\d|30|31)/)[0]
}
