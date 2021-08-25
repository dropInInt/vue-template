/* eslint-disable import/no-duplicates */
/* eslint-disable quotes */
/* eslint-disable handle-callback-err */
import Vue from 'vue'
import axios from 'axios'
import { ACCESS_TOKEN, ACCESS_MENU } from '@/store/mutation-types'
/**
 * Set storage
 *
 * @param name
 * @param content
 * @param maxAge
 */
export const setStore = (name, content, maxAge = null) => {
    if (!global.window || !name) {
        return
    }

    if (typeof content !== 'string') {
        content = JSON.stringify(content)
    }

    const storage = global.window.localStorage

    storage.setItem(name, content)
    if (maxAge && !isNaN(parseInt(maxAge))) {
        const timeout = parseInt(new Date().getTime() / 1000)
        storage.setItem(`${name}_expire`, timeout + maxAge)
    }
}

/**
 * Get storage
 *
 * @param name
 * @returns {*}
 */
export const getStore = name => {
    if (!global.window || !name) {
        return
    }

    const content = window.localStorage.getItem(name)
    const _expire = window.localStorage.getItem(`${name}_expire`)

    if (_expire) {
        const now = parseInt(new Date().getTime() / 1000)
        if (now > _expire) {
            return
        }
    }

    try {
        return JSON.parse(content)
    } catch (e) {
        return content
    }
}

/**
 * Clear storage
 *
 * @param name
 */
export const clearStore = name => {
    if (!global.window || !name) {
        return
    }

    window.localStorage.removeItem(name)
    window.localStorage.removeItem(`${name}_expire`)
}

/**
 * Clear all storage
 */
export const clearAll = () => {
    if (!global.window || !name) {
        return
    }

    window.localStorage.clear()
}

// data filter
export const DataFilter = (res, listKye) => {
    const storageList = res.data
    const storageData = {
        'data': storageList.list ? storageList.list.map((item, index) => {
            return {
                key: listKye + index,
                ...item
            }
        }) : storageList.map((item, index) => {
            return {
                key: listKye + index,
                ...item
            }
        }),
        'pageSize': res.data.pageSize,
        'pageNo': res.data.pages,
        'totalCount': res.data.total,
        'totalPage': res.data.current
    }
    return storageData
}

// 按钮判断
export const BtnShow = (pageName) => {
    // console.info('pageName---',pageName)
    const showList = []
    const menuTree = Vue.ls.get(ACCESS_MENU)
    // console.info('menuTree---',menuTree)
    menuTree.children.map(item => {
        item.children.map(second => {
            second.children.map(third => {
                if (third.menuUrl === pageName) {
                    // console.info('four---',third)
                    third.children.map(btn => {
                        if (showList.indexOf(btn.menuUrl) === -1) {
                            showList.push(btn.menuUrl)
                        }
                    })
                }
            })
        })
    })
    return showList
}

//保存出入库详情或编辑页面params
export const saveParamsFromStore = (params, storageName) => {
    console.log(storageName, 'storageName')
    if (params === null) {
        Vue.ls.set('PRODUCT_' + storageName, {})
    } else {
        Vue.ls.set('PRODUCT_' + storageName, params)
    }

}

//刷新页面获取params
export const getParamsFromStore = (storageName) => {
    console.log(storageName, '获取')
    return Vue.ls.get('PRODUCT_' + storageName)
}

export const exportTable = (params, api, tableTitle) => {
    return axios({
        method: 'post',
        url: api,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            Authorization: 'Bearer ' + Vue.ls.get(ACCESS_TOKEN)
        },
        responseType: 'arraybuffer',
        data: params // data是添加到请求体（body）中的， 用于post请求。
    }).then(res => {
        if (res.status === 200) {
            const link = document.createElement('a')
            const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
            link.style.display = 'none'
            link.href = window.URL.createObjectURL(blob)
            link.download = tableTitle + '.xlsx'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            return true;
        }
    }).catch(error => {
        return error
    })
}
