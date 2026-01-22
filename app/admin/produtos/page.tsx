import { ProductsManager } from "@/components/admin/ProductsManager";

export default function AdminProdutosPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Produtos</h1>
        <p className="mt-1 text-neutral-300">Cadastre e gerencie o catálogo.</p>
      </header>
      <ProductsManager />
    </div>
  );
}
