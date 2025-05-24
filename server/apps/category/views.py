# from django.shortcuts import render

#Observacion: se deben seguir trabajando muchas mas subcategorias, pero por ahora no es necesario 7777

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions

from .models import Category


class ListCategoriesView(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        if Category.objects.all().exists():
            categories = Category.objects.all()

            result = []

            for category in categories:
                if not category.parent:
                    item = {}
                    item['id'] = category.id
                    item['name'] = category.name
                    
                    item['sub_categories'] = []
                    for cat in categories:
                        sub_item = {}
                        if cat.parent and cat.parent.id == category.id:
                            sub_item['id'] = cat.id
                            sub_item['name'] = cat.name
                            sub_item['sub_categories'] = []

                            item['sub_categories'].append(sub_item)
                    result.append(item)
            return Response({'categories': result}, status=status.HTTP_200_OK) # En Redux, 'action.payload' será este objeto {'categories': result}. El reducer luego usa 'payload.categories' para asignar la lista 'result' a 'state.categories'.
        else:
            return Response({'error': 'No categories found'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
