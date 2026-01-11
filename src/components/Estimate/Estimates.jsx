import { useEffect } from 'react'
import { FileText, Eye, Edit, Download, Calendar, User2, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { ButtonRecovery } from '../global/Button'
import { GetDevis } from '../../api/get/GetDevis'
import { RecoveryDevis } from '../../api/post/RecoveryDevis'


export function Estimates({ token, onEditDevis, onShowInfosDevis, onDeleteDevis, statusFilter, filters }) {
  console.log('Estimates statusFilter:', statusFilter);
  console.log('Estimates filters:', filters);

  // Pour les statuts normaux (valide, attente), on filtre côté client
  // Pour "supprime", on utilise l'API
  const shouldUseApiFilter = statusFilter === 'supprime';
  const { data: rawData, isPending, isError, error } = GetDevis(token, shouldUseApiFilter ? statusFilter : null)
  const { mutate: recoverdevis, isPending: isRecovering, isSuccess: isSuccesRecoveryDevis, data: dataRecoveryDevis } = RecoveryDevis(token);

  // Filtrage côté client pour statuts + nom + dates (tous filtres)
  const data = rawData && !shouldUseApiFilter
    ? rawData.filter(devis => {
      if (!devis || typeof devis !== 'object') return false;

      // Statut (un seul vrai à la fois)
      if (filters.status.valide && devis.status !== 'valide') return false;
      if (filters.status.attente && devis.status !== 'attente') return false;

      // NOM DU CLIENT: tester aussi avec champ name_customer SEUL ou first_name_customer SEUL
      if (filters.client) {
        const nom = String(devis.name_customer || '').toLowerCase();
        const prenom = String(devis.first_name_customer || '').toLowerCase();
        const cherche = filters.client.toLowerCase();
        if (!nom.includes(cherche) && !prenom.includes(cherche)) return false;
      }

      // Date début (création)
      if (filters.dateRange.start && devis.created_at) {
        try {
          const start = new Date(filters.dateRange.start);
          const createdAt = new Date(devis.created_at);
          if (
            createdAt.getFullYear() !== start.getFullYear() ||
            createdAt.getMonth() !== start.getMonth() ||
            createdAt.getDate() !== start.getDate()
          ) {
            return false;
          }
        } catch (error) {
          return false;
        }
      }

      // Date fin (impression)
      if (filters.dateRange.end && devis.printing_time) {
        try {
          const end = new Date(filters.dateRange.end);
          const printingTime = new Date(devis.printing_time);
          if (
            printingTime.getFullYear() !== end.getFullYear() ||
            printingTime.getMonth() !== end.getMonth() ||
            printingTime.getDate() !== end.getDate()
          ) {
            return false;
          }
        } catch (error) {
          return false;
        }
      }

      return true;
    })
    : rawData

  useEffect(() => {
    if (isSuccesRecoveryDevis && dataRecoveryDevis?.message) toast.success(dataRecoveryDevis.message);
    if (isSuccesRecoveryDevis && dataRecoveryDevis?.detail) toast.error(dataRecoveryDevis.detail);
  }, [isSuccesRecoveryDevis]);

  useEffect(() => {
    if (isError) toast.error(error?.message || error || 'Erreur réseau')
  }, [isError, error])

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString('fr-FR') : '—'

  const getStatusColor = (status) => {
    if (!status) return 'bg-slate-500/20 text-slate-300 border border-slate-500/30'

    switch (status) {
      case 'attente':
        return 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
      case 'valide':
        return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
      case 'rejeter':
        return 'bg-red-500/20 text-red-300 border border-red-500/30'
      case 'revoquer':
        return 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
      default:
        return 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
    }
  };

  const getStatusLabel = () => 'Devis'

  return (
    <div className="space-y-4">
      {isPending ? (
        <div className="futuristic-card rounded-2xl p-6 text-slate-400">Chargement des devis...</div>
      ) : Array.isArray(data) && data.length > 0 ? data
        .filter(devis => devis && typeof devis === 'object')
        .map((devis, index) => (
          <div
            key={devis?.id || index}
            className="futuristic-card rounded-2xl p-6 hover:scale-[1.01] transition-all duration-500 cursor-pointer group slide-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Effet de grille en arrière-plan */}
            <div className="absolute inset-0 opacity-5 rounded-2xl">
              <div className="grid-pattern w-full h-full"></div>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <div className="p-2 rounded-xl bg-indigo-500/20 group-hover:bg-indigo-500/30 transition-colors duration-300">
                    <FileText className="w-6 h-6 text-indigo-400 group-hover:text-indigo-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">
                    {devis?.name_product || 'Nom inconnu'}
                  </h3>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                    <User2 className="w-4 h-4" />
                    <span>
                      {devis?.name_customer || ''} {devis?.first_name_customer || ''}
                    </span>
                  </div>
                  <div className="text-sm text-slate-500 mt-2 group-hover:text-slate-400 transition-colors">
                    Créé le {formatDate(devis.created_at)}
                  </div>
                </div>
              </div>
              <div className="flex space-y-3">
                <div className="flex flex-col gap-2 flex-1">
                  <div className="flex items-center gap-2 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                    <FileText className="w-4 h-4" />
                    <span>Impression : {devis?.impression || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                    <Calendar className="w-4 h-4" />
                    <span>Échéance : {devis?.printing_time ? formatDate(devis.printing_time) : '—'}</span>
                  </div>
                  <p className="text-sm text-slate-500 group-hover:text-slate-400 line-clamp-3 transition-colors">
                    {devis.description ?? devis.description_devis}
                  </p>
                </div>
                <div className="">
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-medium rounded-full backdrop-blur-sm ${getStatusColor(devis.status)}`}
                  >
                    {devis.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between lg:justify-end gap-6">
                <div className="flex flex-col gap-4 text-right">
                  <div className="text-2xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {devis?.montant_ttc ? devis.montant_ttc.toLocaleString('fr-FR') : '—'} FCFA
                    <div className="text-sm text-slate-500 group-hover:text-slate-400 transition-colors">TTC</div>
                  </div>

                  <div className="flex justify-end gap-2">
                    {shouldUseApiFilter ?
                      <ButtonRecovery onClick={() => devis?.id && recoverdevis(devis.id)} />
                      :
                      <>
                        <button
                          onClick={() => {
                            if (onShowInfosDevis && typeof onShowInfosDevis === 'function' && devis) {
                              onShowInfosDevis(devis)
                            }
                          }}
                          className="p-2 hover:bg-indigo-500/20 rounded-xl transition-all duration-300 group/btn"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4 text-indigo-400 group-hover/btn:text-indigo-300" />
                        </button>
                        <button
                          onClick={() => {
                            if (onEditDevis && typeof onEditDevis === 'function' && devis) {
                              onEditDevis(devis)
                            }
                          }}
                          className="p-2 hover:bg-emerald-500/20 rounded-xl transition-all duration-300 group/btn"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4 text-emerald-400 group-hover/btn:text-emerald-300" />
                        </button>
                        <button
                          className="p-2 hover:bg-purple-500/20 rounded-xl transition-all duration-300 group/btn"
                          title="Télécharger"
                        >
                          <Download className="w-4 h-4 text-purple-400 group-hover/btn:text-purple-300" />
                        </button>
                        <button
                          onClick={() => {
                            if (onDeleteDevis && typeof onDeleteDevis === 'function' && devis) {
                              onDeleteDevis(devis)
                            }
                          }}
                          className="p-2 hover:bg-red-500/20 rounded-xl transition-all duration-300 group/btn"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4 text-red-400 group-hover/btn:text-red-300" />
                        </button>
                      </>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        )) : (
        <div className="futuristic-card rounded-2xl p-6 text-center text-slate-400">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center">
              <span className="text-slate-500">📄</span>
            </div>
            <span>Aucun devis trouvé</span>
          </div>
        </div>
      )}
    </div>
  )
}
