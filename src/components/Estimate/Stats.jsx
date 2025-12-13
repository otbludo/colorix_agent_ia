import { FileText, DollarSign} from 'lucide-react'

export function StatEstimate(){
    return(
         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-600">Total devis</p>
                    <p className="text-2xl font-bold text-blue-900">32</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">✓</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-600">Total devis valide</p>
                    <p className="text-2xl font-bold text-green-900">
                      22
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <FileText className="w-8 h-8 text-yellow-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-yellow-600">Total devis en attente</p>
                    <p className="text-2xl font-bold text-yellow-900">
                      sent
                    </p>
                  </div>
                </div>
              </div>
            </div>
    )
}