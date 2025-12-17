const app = getApp()

Page({
  data: {
    list: [],
    loading: false,
    serverBase: 'http://localhost:3000'
  },

  onShow() {
    this.fetchList()
  },

  refresh() {
    this.fetchList()
  },

  fetchList() {
    const userId = (app.globalData && app.globalData.userId) || 1
    this.setData({ loading: true })
    wx.request({
      url: `${app.globalData.apiBase}/miniprogram/attendance`,
      method: 'GET',
      data: { userId },
      success: (res) => {
        if (res.data && res.data.success) {
          const list = (res.data.data || []).map((it) => ({
            ...it,
            timestamp: new Date(it.timestamp).toLocaleString()
          }))
          this.setData({ list })
        }
      },
      complete: () => {
        this.setData({ loading: false })
        wx.stopPullDownRefresh()
      }
    })
  },

  onPullDownRefresh() {
    this.fetchList()
  }
})
