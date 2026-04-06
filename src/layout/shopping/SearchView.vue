<script setup>
import { computed, onMounted, ref } from 'vue'
import { useProductStore } from '@/stores/product'

const keyword = ref('')
const categoryId = ref(0)
const loading = ref(false)
const productStore = useProductStore()

const categoryOptions = computed(() => [
    { id: 0, name: '全部分类' }, 
    ...productStore.categoryList
])

const results = computed(() => {
    return productStore.productsWithCategory.filter((item) => {
        const matchKeyword =
            item.name.toLowerCase().includes(keyword.value.toLowerCase()) ||
            item.desc.toLowerCase().includes(keyword.value.toLowerCase())
        const matchCategory = categoryId.value === 0 || item.category_id === categoryId.value
        return matchKeyword && matchCategory
    })
})

async function fetchData() {
    loading.value = true
    try {
        await Promise.all([
            productStore.fetchCategoryList(), 
            productStore.fetchProductList()
        ])
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchData()
})
</script>

<template>
    <section class="search-wrap">
        <div class="search-bar">
            <el-input v-model="keyword" placeholder="搜索商品名或描述" clearable />
            <el-select v-model="categoryId" style="width: 150px">
                <el-option
                    v-for="option in categoryOptions"
                    :key="option.id"
                    :label="option.name"
                    :value="option.id"
                />
            </el-select>
        </div>

        <p class="summary">共找到 {{ results.length }} 条商品记录</p>

        <el-table :data="results" :loading="loading" stripe>
            <el-table-column label="商品" min-width="260">
                <template #default="{ row }">
                    <div class="cell-product">
                        <img :src="row.image_url" :alt="row.name" />
                        <div>
                            <strong>{{ row.name }}</strong>
                            <p>{{ row.desc }}</p>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="分类" min-width="120">
                <template #default="{ row }">{{ row.category?.name }}</template>
            </el-table-column>
            <el-table-column label="价格" width="100">
                <template #default="{ row }">¥{{ row.price.toFixed(2) }}</template>
            </el-table-column>
            <el-table-column prop="stock" label="库存" width="90" />
            <el-table-column label="状态" width="100">
                <template #default="{ row }">
                    <el-tag :type="row.status === 'on' ? 'success' : 'info'">{{ row.status }}</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </section>
</template>

<style scoped>
.search-wrap {
    border-radius: 16px;
    border: 1px solid #d8e1e8;
    background: #ffffff;
    padding: 14px;
}

.search-bar {
    display: flex;
    gap: 10px;
}

.summary {
    margin: 10px 0;
    color: #7b8794;
    font-size: 13px;
}

.cell-product {
    display: flex;
    gap: 10px;
    align-items: center;
}

.cell-product img {
    width: 48px;
    height: 48px;
    border-radius: 6px;
    object-fit: cover;
}

.cell-product p {
    margin: 4px 0 0;
    color: #52606d;
    font-size: 12px;
}

@media (max-width: 768px) {
    .search-bar {
        flex-direction: column;
    }
}
</style>