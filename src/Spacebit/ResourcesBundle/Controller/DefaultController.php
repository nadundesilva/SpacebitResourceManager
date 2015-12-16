<?php

namespace Spacebit\ResourcesBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    public function homeAction()
    {
        return $this->render('SpacebitResourcesBundle:Default:home.html.twig');
    }

    public function equipmentAction()
    {

        return $this->render('SpacebitResourcesBundle:Default:equipment.html.twig', array(

        ));
    }

    public function locationsAction()
    {
        return $this->render('SpacebitResourcesBundle:Default:locations.html.twig');
    }


    public function venuesAction()
    {
        //$request = Request::createFromGlobals();
        //$category = $request->query->get('category');

        $conn = $this->get('database_connection');
        $stmt = $conn->prepare('SELECT * FROM venue');
        //$stmt->bindValue(':category', $category);
        $stmt->execute();
        $result = $stmt->fetchAll();

        return $this->render('SpacebitResourcesBundle:Default:venues.html.twig', array(
            'venue_categories'=>$result,
        ));
    }
}
