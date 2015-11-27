//sign in
//$("#signIn").validate({
//    submitHandler: function (form){
//	signIn();	
//}
//    
//});
$(function() {

	$('#signIn').submit( function (e)
	{
		//name = $('#uname').attr('value');
		var email = $('#uemail').val();
		var pass = $('#upass').val();	
		
		$.ajax({url:'api/signin',
		data: JSON.stringify({'uemail':email , 'upass':pass}),
		contentType: "application/json",
		type:'post', 
		success : function(output){
			
			$('#username').html(email);
			//get new query pair
			getNextPair();
			//get new entity	
			getNextEntity();	
			$.mobile.changePage( $("#my-stats"), { transition: "slideup"} );
		},
		error : function(output)
		{
			alert(output);
		}
		
		});
		$('#upass').val('');
		$('#uemail').val('');
		e.preventDefault();
		e.stopPropagation();
		return false;
		
	});

	$('#task-label-form').submit(function (e)
	{
		var pairId = $('#pair-id').html();
		var label = $("input[@name='task-type']:checked").val();
		var uname = $('#username').html();
		//alert(pairId+' '+label+' '+uname); 
		
		$.ajax({url:'api/submitPair',
		data:JSON.stringify({'pairId':pairId,'label':label, 'uname':uname}),
		type:'post', 
		contentType: "application/json",
		success : function(output){
			if(output)
				getNextPair();
		}
		});
		e.preventDefault();
		e.stopPropagation();
		return false;
	});


	$('#entity-label-form').submit(function (e)
	{
		var entityId = $('#entity-id').html(); 
		var t1 = $("#task-1").attr('value');
		var t2 = $("#task-2").attr('value');
		var t3 = $("#task-3").attr('value');
		var uname = $('#username').html();

		$.ajax({url:'api/submitEntityTask',
		data:JSON.stringify({'t1':t1,'t2':t2,'t3':t3,'entityId':entityId,'uname':uname}),
		contentType: "application/json",
		type:'post', 
		success : function(output){
			if(output)
				getNextEntity();
		}
		});
		e.preventDefault();
		e.stopPropagation();
		return false;
	});


});


function signOut()
{
	
	$.ajax({url:'api/signout',
	data:JSON.stringify({'uname':$('#username').html()}),
	type:'post', 
	contentType: "application/json",
	success : function(output){
		if(output)
		{
			$('#username').html('');
			
			$('#pair-id').html('');
			$('#query1').html('');
			$('#query1').html('');
			$("#task-type_5").attr('checked', true);
			
			$('#entity-id').html('');
			$('#entity-name').html('');
			$('#entity-query').html('');
			$('#task-1').val('');
			$('#task-2').val('');
			$('#task-3').val('');

			$.mobile.changePage( $("#task-genie"), { transition: "slideup"} );
			
		}
	}
	
	});
}
//get pairs
function getNextPair()
{
	//alert($('#username').html());
	$.ajax({url:'api/getNextPair',
	data:JSON.stringify({'uname':$('#username').html()}),
	type:'post', 
	contentType: "application/json",
	success : function(output){
		if(output)
		{
			//alert(output);
			//get the next pair 
			$('#pair-id').html(output[0]);
			$('#query1').html(output[1][0]);
			$('#query2').html(output[1][1]);
			
			$("#task-type_5").prop('checked', true);
			//set the pair id and query values
		}
	}
	});
}

//submit labels

//get entities
function getNextEntity()
{
	$.ajax({url:'api/getNextEntity',
	data:JSON.stringify({'uname':$('#username').html()}),
	contentType: "application/json",
	type:'post', 
	success : function(output){
		if(output)
		{
			//alert('Entity is '+output);
			$('#entity-id').html(output[0]);
			$('#entity-name').html(output[1]);
			$('#entity-query').html(output[2]);
			$('#task-1').val('');
			$('#task-2').val('');
			$('#task-3').val('');
		}
	}
	});



}

//submit tasks
