<?php

namespace Spacebit\AdminBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use \Symfony\Component\HttpFoundation\Response;
use \Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    public function homeAction()
    {
        return $this->render('SpacebitAdminBundle:Default:home.html.twig');
    }

    public function sampleAction()
    {
        return $this->render('SpacebitAdminBundle:Default:sample.html.twig');
    }
    public function resourceAction()
    {
        return $this->render('SpacebitAdminBundle:Default:resource.html.twig');
    }

//    public function addEquipmentAction()
//    {
//        $request = Request::createFromGlobals();
//        $category = $request->request->get('category');
//
//        $conn = $this->get('database_connection');
//        $stmt = $conn->prepare('SELECT * FROM vehicle WHERE type = :category;');
//        $stmt->bindValue(':category', $category);
//        $stmt->execute();
//        $result = $stmt->fetchAll();
//    }
    public function addEquipmentAction()
    {
        $request = Request::createFromGlobals();
        $resource_id= $request->request->get('resource_id');
        $availability = $request->request->get('availability');
        $availability = $availability =='on'? true : false;
        $description = $request->request->get('description');
        $value1 = $request->request->get('value1');



        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('INSERT into resource values(:resource_id , :availability , :description);');
        $stmt->bindValue(':resource_id', $resource_id);
        $stmt->bindValue(':availability', $availability);
        $stmt->bindValue(':description',$description );
        $stmt->execute();

        $stmt = $conn->prepare('INSERT into equipment values(:resource_id , :value1);');
        $stmt->bindValue(':resource_id', $resource_id);
        $stmt->bindValue(':value1', $value1);

        $stmt->execute();

        return new Response('success');
    }
}
