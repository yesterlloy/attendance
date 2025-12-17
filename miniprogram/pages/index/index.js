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
      type: 'gcj02', // 坐标系必须为gcj02（腾讯/高德地图通用），不要用wgs84
      success(res) {
        console.log('location res', res)

         const { latitude, longitude } = res;
        // 2. 调用腾讯地图逆地理编码接口
        wx.request({
          url: 'https://apis.map.qq.com/ws/geocoder/v1/',
          data: {
            location: `${latitude},${longitude}`, // 纬度,经度
            key: '你的腾讯地图key', // 需申请腾讯地图key（见下方说明）
            get_poi: 0 // 是否返回周边POI，0=不返回，1=返回
          },
          success: (res) => {
            if (res.data.status === 0) {
              // 解析详细地址
              const address = res.data.result.address; // 省市区街道完整地址
              const addressComponent = res.data.result.address_component; // 拆分的地址组件
              const detailAddress = `${addressComponent.province}${addressComponent.city}${addressComponent.district}${addressComponent.street}${addressComponent.street_number}`;
              
              console.log('完整地址：', address);
              console.log('拆分地址：', detailAddress);
              wx.showToast({ title: `当前地址：${address}`, icon: 'none' });

              that.setData({
                latitude: res.latitude,
                longitude: res.longitude,
                address: detailAddress
              });
            } else {
              wx.showToast({ title: '地址解析失败', icon: 'none' });
            }
          },
          fail: () => {
            wx.showToast({ title: '网络错误', icon: 'none' });
          }
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
