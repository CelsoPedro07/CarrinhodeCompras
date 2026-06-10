import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Product } from '@/types'
import { Button } from '@/components/ui/button'

interface ProductDetailsDialogProps {
  product: Product
  open: boolean
  onClose: () => void
  onDelete?: (id: string) => void
}

export function ProductDetailsDialog({ product, open, onClose, onDelete }: ProductDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Detalhes do produto</DialogTitle>
        <DialogDescription>Visualize as informações completas do produto.</DialogDescription>
        <div className="mt-6 space-y-4 text-sm text-slate-700 dark:text-slate-300">
          <p><strong>Nome:</strong> {product.name}</p>
          <p><strong>Categoria:</strong> {product.category}</p>
          <p><strong>Preço:</strong> R$ {product.price.toFixed(2)}</p>
          <p><strong>Estoque:</strong> {product.stock}</p>
          <p><strong>Avaliação:</strong> {product.rating.toFixed(1)} ★</p>
        </div>
        <div className="mt-6 flex gap-2">
          {onDelete ? (
            <Button size="sm" variant="destructive" onClick={() => onDelete(product._id)}>
              Deletar
            </Button>
          ) : null}
          <Button size="sm" onClick={onClose}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
