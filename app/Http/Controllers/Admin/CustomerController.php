<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CustomerRequest;
use App\Models\Customer;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * CLIENTES: registro con datos personales, CI (extensión y expedido), contacto y foto.
 * Permisos: clientes.ver · clientes.crear · clientes.editar · clientes.eliminar
 */
class CustomerController extends Controller
{
    /**
     * GET /admin/customers — Lista con buscador, filtro por estado y paginación.
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'status', 'per_page']);

        $customers = Customer::with('registeredBy:id,name')
            ->search($filters['search'] ?? null)
            ->when($filters['status'] ?? null, fn (Builder $q, string $status) => $q->where('is_active', $status === 'active'))
            ->latest('id')
            ->paginate($this->perPage($request))
            ->withQueryString();

        return Inertia::render('admin/customers/index', [
            'customers' => $customers,
            'filters' => $filters,
            'issuedIn' => Customer::ISSUED_IN,
            'genders' => Customer::GENDERS,
            'phoneCountries' => collect(Customer::PHONE_COUNTRIES)->map(fn (array $country, string $dial) => [...$country, 'dial' => $dial])->values(),
        ]);
    }

    /**
     * POST /admin/customers — Registra un cliente.
     */
    public function store(CustomerRequest $request): RedirectResponse
    {
        $customer = Customer::create($this->customerData($request));

        return back()->with('success', "Cliente {$customer->full_name} registrado.");
    }

    /**
     * PUT /admin/customers/{customer} — Actualiza un cliente.
     */
    public function update(CustomerRequest $request, Customer $customer): RedirectResponse
    {
        $customer->update($this->customerData($request, $customer));

        return back()->with('success', "Cliente {$customer->full_name} actualizado.");
    }

    /**
     * DELETE /admin/customers/{customer} — Eliminación LÓGICA (regla del sistema).
     */
    public function destroy(Customer $customer): RedirectResponse
    {
        $customer->delete();

        return back()->with('success', "Cliente {$customer->full_name} eliminado.");
    }

    /**
     * Datos validados listos para guardar, con la ruta de la foto.
     *
     * @return array<string, mixed>
     */
    private function customerData(CustomerRequest $request, ?Customer $customer = null): array
    {
        return ['photo' => $this->storeImage($request, 'photo', 'customers', $customer?->photo)]
            + collect($request->validated())->except(['photo', 'remove_photo'])->all();
    }
}
