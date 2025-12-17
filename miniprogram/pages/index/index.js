const app = getApp()

Page({
  data: {
    latitude: null,
    longitude: null,
    address: '',
    imagePath: null,
    userId: 1 // Mock user ID (Demo User)
  },

  onLoad: function () {
    this.getLocation();
  },

  getLocation: function () {
    const that = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          address: 'Location acquired' // In real app, reverse geocode here
        });
      },
      fail(err) {
        console.error(err);
        wx.showToast({
          title: 'Location failed',
          icon: 'none'
        });
      }
    });
  },

  chooseImage: function () {
    const that = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['camera', 'album'],
      success(res) {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        that.setData({
          imagePath: tempFilePath
        });
      }
    });
  },

  submitAttendance: function () {
    const that = this;
    if (!this.data.imagePath || !this.data.latitude) {
      return;
    }

    wx.showLoading({ title: 'Submitting...' });

    wx.uploadFile({
      url: `${app.globalData.apiBase}/miniprogram/attendance`,
      filePath: that.data.imagePath,
      name: 'image',
      formData: {
        userId: that.data.userId,
        latitude: that.data.latitude,
        longitude: that.data.longitude,
        address: that.data.address || 'Unknown Address',
        type: 'check-in'
      },
      success(res) {
        wx.hideLoading();
        const data = JSON.parse(res.data);
        if (data.success) {
          wx.showToast({
            title: 'Success!',
            icon: 'success'
          });
          // Reset
          that.setData({ imagePath: null });
        } else {
          wx.showToast({
            title: 'Failed: ' + data.message,
            icon: 'none'
          });
        }
      },
      fail(err) {
        wx.hideLoading();
        console.error(err);
        wx.showToast({
          title: 'Network Error',
          icon: 'none'
        });
      }
    });
  },

  goRecords: function () {
    wx.navigateTo({ url: '/pages/records/index' })
  }
})
