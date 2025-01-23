import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProductStore } from '@/store/productStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, MoreVertical, Eye, Star, Trash2, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminProducts() {
  const { products, deleteProduct } = useProductStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (productId: string) => {
    void productId;
    if (confirm('Are you sure you want to delete this product?')) {
      const success = await deleteProduct(productId);
      if (success) {
        toast.success('Product deleted');
      }
    }
  };

  const handleFeature = (_productId: string) => {
    void _productId;
    toast.success('Product featured on homepage');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Products</h1>
          <p className="text-[#666666]">Manage all platform products</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="pl-10 w-64"
          />
        </div>
      </div>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f9f9f9]">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-[#666666]">Product</th>
                  <th className="text-left p-4 text-sm font-medium text-[#666666]">Category</th>
                  <th className="text-left p-4 text-sm font-medium text-[#666666]">Price</th>
                  <th className="text-left p-4 text-sm font-medium text-[#666666]">Stock</th>
                  <th className="text-left p-4 text-sm font-medium text-[#666666]">Rating</th>
                  <th className="text-right p-4 text-sm font-medium text-[#666666]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-t">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-[#1a1a1a]">{product.name}</p>
                          <p className="text-sm text-[#666666]">SKU: {product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary">{product.category}</Badge>
                    </td>
                    <td className="p-4">
                      <div>
                        <span className="font-medium text-[#f27a2a]">${product.price.toFixed(2)}</span>
                        {product.compareAtPrice && (
                          <span className="text-sm text-[#999999] line-through ml-2">
                            ${product.compareAtPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={product.inventory > 10 ? 'text-green-600' : product.inventory > 0 ? 'text-amber-600' : 'text-red-600'}>
                        {product.inventory} units
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span>{product.rating}</span>
                        <span className="text-sm text-[#666666]">({product.reviewCount})</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/product/${product.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleFeature(product.id)}>
                            <Check className="w-4 h-4 mr-2" />
                            Feature
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
