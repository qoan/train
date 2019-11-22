<template>
  <div>
    <!-- 政府 -->
    <el-dialog
      v-if="roler === 'gov'"
      title="编辑"
      :visible.sync="dialogVisible"
      width="400px">
      <el-form :inline="true" class="add-form">
        <el-form-item label="调动至：">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <p>注: 当你点击提交后，您的岗位将会北调动至"天河潭新区"</p>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">提 交</el-button>
      </span>
    </el-dialog>
    <!-- 学校 -->
    <el-dialog
      v-if="roler === 'gov'"
      title="编辑"
      :visible.sync="dialogVisible"
      width="400px">
      <el-form :inline="true" class="add-form">
        <el-form-item label="调动至：">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <p>注: 当你点击提交后，您的岗位将会北调动至"天河潭新区"</p>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roler: '',
      value: '',
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      dialogVisible: false
    }
  },
  created () {
    this.roler = sessionStorage.getItem('roler')
  }
}
</script>
