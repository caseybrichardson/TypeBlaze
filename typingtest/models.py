from django.db import models

class Feature(models.Model):
	name = models.CharField(max_length=140, unique=True)

	def __str__(self):
		return '%s' % self.name

class TypingTest(models.Model):
	name = models.CharField(max_length=140, unique=True)
	text = models.CharField(max_length=1024)
	upvotes = models.IntegerField(default=0)
	downvotes = models.IntegerField(default=0)
	features = models.ForeignKey(Feature)
	times_taken = models.IntegerField(default=0)

	def __str__(self):
		return '%s' % self.name