from django.shortcuts import render, get_object_or_404
from django.http import Http404, JsonResponse
from django.template import RequestContext, loader
from django.views import generic

from .models import TypingTest

class IndexView(generic.ListView):
	template_name = 'typingtest/index.html'
	context_object_name = 'latest_typingtest_list'

	def get_queryset(self):
		return TypingTest.objects.order_by('-pk')[:5]

class DetailView(generic.DetailView):
	template_name = 'typingtest/detail.html'
	model = TypingTest

def vote(request, typing_test_id):
	try:
		typingtest = TypingTest.objects.get(pk=typing_test_id)
		vote_value = request.POST['vote']
		if vote_value == '1':
			typingtest.upvotes = typingtest.upvotes + 1
		elif vote_value == '2':
			typingtest.downvotes = typingtest.downvotes + 1
		else:
			return JsonResponse({'previousVote': False, 'error': 'Invalid vote value %s' % vote_value})

		typingtest.save()
	except TypingTest.DoesNotExist:
		return JsonResponse({'previousVote': False, 'error': 'Cannot vote on a question that does not exist.'})

	return JsonResponse({'previousVote': False, 'newUpvotes': typingtest.upvotes, 'newDownvotes': typingtest.downvotes})