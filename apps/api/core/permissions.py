def check_permission(request):
    risk = request.get('risk','LOW')

    if risk == 'HIGH':
        return 'Explicit approval required'

    return True
