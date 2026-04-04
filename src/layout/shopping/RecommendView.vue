<script setup>
import { computed, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'

const props = defineProps({
    selectedCategory: {
        type: Number,
        default: 0,
    },
})

const adminStore = useAdminStore()

const products = computed(() =>
    adminStore.productsWithCategory
        .filter((item) => {
            const matchCategory =
                props.selectedCategory === 0 || item.category_id === props.selectedCategory
            return matchCategory && item.status === 'on'
        })
        .sort((a, b) => Number(b.sold_count || 0) - Number(a.sold_count || 0))
        .slice(0, 10),
)

onMounted(() => {
    adminStore.fetchCategoryList()
    adminStore.fetchProductList()
})
</script>

<template>
    <section class="recommend-wrap">
        <div class="section-head">
            <h2>猜你喜欢</h2>
            <small>当前展示销量前 10 商品 {{ products.length }} 件</small>
        </div>

        <div class="product-grid">
            <article v-for="item in products" :key="item.id" class="product-card">
                <img :src="item.image_url" :alt="item.name" />
                <div class="content">
                    <el-tag size="small" type="success">{{ item.category?.name }}</el-tag>
                    <h3>{{ item.name }}</h3>
                    <p>{{ item.desc }}</p>
                    <footer>
                        <strong>¥{{ item.price.toFixed(2) }}</strong>
                        <span>已售 {{ item.sold_count }}</span>
                    </footer>
                </div>
            </article>
        </div>
    </section>
</template>

<style scoped>
.recommend-wrap {
    border-radius: 16px;
    border: 1px solid #d8e1e8;
    background: #ffffff;
    padding: 14px;
}

.section-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.section-head h2 {
    margin: 0;
    color: #1f2933;
}

.section-head small {
    color: #7b8794;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
    gap: 12px;
}

.product-card {
    border: 1px solid #e4e7eb;
    border-radius: 12px;
    overflow: hidden;
    background: #fffefc;
}

.product-card img {
    width: 100%;
    height: 150px;
    object-fit: cover;
}

.content {
    padding: 10px;
}

.content h3 {
    margin: 8px 0 0;
    font-size: 15px;
}

.content p {
    margin: 8px 0;
    color: #52606d;
    font-size: 13px;
    min-height: 34px;
}

footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

footer strong {
    color: #c05621;
}

footer span {
    font-size: 12px;
    color: #7b8794;
}
</style>