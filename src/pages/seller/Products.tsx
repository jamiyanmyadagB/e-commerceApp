import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
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
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Star
} from 'lucide-react';
import { toast } from 'sonner';

export default function SellerProducts() {
  const { seller } = useAuthStore();
  const { getProductsBySeller, deleteProduct } = useProductStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  
  const products = seller ? getProductsBySeller(seller.id) : [];
  
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const success = await deleteProduct(productId);
      if (success) {
        toast.success('Product deleted successfully');
      } else {
        toast.error('Failed to delete product');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">My Products</h1>
          <p className="text-[#666666]">Manage your product listings</p>
        </div>
        <Link to="/seller/products/add">
          <Button className="bg-[#f27a2a] hover:bg-[#e06d1f] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products by name or SKU..."
          className="pl-10"
        />
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-video overflow-hidden bg-[#f9f9f9]">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
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
                        <DropdownMenuItem asChild>
                          <Link to={`/seller/products/edit/${product.id}`}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Link>
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
                  </div>
                  {!product.isActive && (
                    <Badge className="absolute top-3 left-3 bg-gray-500">
                      Inactive
                    </Badge>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-[#1a1a1a] line-clamp-1">{product.name}</h3>
                      <p className="text-sm text-[#666666]">SKU: {product.sku}</p>
                    </div>
                    <p className="font-bold text-[#f27a2a]">${product.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[#666666]">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      {product.rating}
                    </div>
                    <span>{product.soldCount} sold</span>
                    <span className={product.inventory > 10 ? 'text-green-600' : product.inventory > 0 ? 'text-amber-600' : 'text-red-600'}>
                      {product.inventory} in stock
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-[#f9f9f9] rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-[#999999]" />
            </div>
            <h3 className="text-lg font-medium text-[#1a1a1a] mb-2">
              {searchQuery ? 'No products found' : 'No products yet'}
            </h3>
            <p className="text-[#666666] mb-4">
              {searchQuery 
                ? 'Try adjusting your search' 
                : 'Start by adding your first product'}
            </p>
            {!searchQuery && (
              <Link to="/seller/products/add">
                <Button className="bg-[#f27a2a] hover:bg-[#e06d1f] text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
